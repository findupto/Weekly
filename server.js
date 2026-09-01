const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.POS_API_KEY || 'change-me';
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function load() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = {
      products: [
        { id: 'p1', name: 'Milk 1L', sku: 'MILK-1L', price: 280, stock: 50, category: 'Dairy' },
        { id: 'p2', name: 'Bread', sku: 'BREAD', price: 150, stock: 35, category: 'Bakery' },
        { id: 'p3', name: 'Eggs 12 Pack', sku: 'EGGS-12', price: 360, stock: 25, category: 'Dairy' },
        { id: 'p4', name: 'Cooking Oil 1L', sku: 'OIL-1L', price: 590, stock: 20, category: 'Grocery' }
      ],
      orders: [],
      settings: { currency: 'PKR', storeName: 'Weekly POS' }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function save(db) { fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2)); }
function auth(req, res, next) {
  if (req.path === '/api/health' || req.method === 'GET' && req.path === '/api/products') return next();
  if (req.headers['x-api-key'] !== API_KEY) return res.status(401).json({ error: 'Invalid API key' });
  next();
}

app.use('/api', auth);
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'weekly-pos', time: new Date().toISOString() }));
app.get('/api/products', (req, res) => {
  const db = load();
  const q = String(req.query.q || '').toLowerCase();
  res.json(db.products.filter(p => !q || `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(q)));
});
app.post('/api/products', (req, res) => {
  const db = load();
  const { name, sku, price, stock = 0, category = 'General' } = req.body;
  if (!name || !sku || Number(price) < 0) return res.status(400).json({ error: 'name, sku and valid price are required' });
  if (db.products.some(p => p.sku === sku)) return res.status(409).json({ error: 'SKU already exists' });
  const product = { id: crypto.randomUUID(), name, sku, price: Number(price), stock: Number(stock), category };
  db.products.push(product); save(db); res.status(201).json(product);
});
app.patch('/api/products/:id', (req, res) => {
  const db = load(); const p = db.products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  Object.assign(p, req.body);
  if (p.price != null) p.price = Number(p.price);
  if (p.stock != null) p.stock = Number(p.stock);
  save(db); res.json(p);
});
app.get('/api/orders', (req, res) => {
  const db = load(); res.json(db.orders.slice().reverse());
});
app.post('/api/orders', (req, res) => {
  const db = load();
  const { items, paymentMethod = 'cash', customer = null, discount = 0 } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'Order items are required' });
  const normalized = [];
  let subtotal = 0;
  for (const item of items) {
    const p = db.products.find(x => x.id === item.productId);
    const qty = Number(item.qty);
    if (!p || !Number.isInteger(qty) || qty < 1) return res.status(400).json({ error: 'Invalid product or quantity' });
    if (p.stock < qty) return res.status(409).json({ error: `Insufficient stock for ${p.name}` });
    const lineTotal = p.price * qty; subtotal += lineTotal;
    normalized.push({ productId: p.id, name: p.name, sku: p.sku, qty, price: p.price, total: lineTotal });
  }
  const safeDiscount = Math.max(0, Number(discount) || 0);
  const total = Math.max(0, subtotal - safeDiscount);
  normalized.forEach(i => { db.products.find(p => p.id === i.productId).stock -= i.qty; });
  const order = { id: crypto.randomUUID(), number: `W-${Date.now()}`, items: normalized, subtotal, discount: safeDiscount, total, paymentMethod, customer, status: 'paid', createdAt: new Date().toISOString() };
  db.orders.push(order); save(db); res.status(201).json(order);
});
app.get('/api/dashboard', (req, res) => {
  const db = load(); const today = new Date().toISOString().slice(0, 10);
  const orders = db.orders.filter(o => o.createdAt.startsWith(today));
  res.json({ salesToday: orders.reduce((s, o) => s + o.total, 0), ordersToday: orders.length, products: db.products.length, lowStock: db.products.filter(p => p.stock <= 5).length });
});
app.get('/api/settings', (req, res) => res.json(load().settings));
app.put('/api/settings', (req, res) => { const db = load(); db.settings = { ...db.settings, ...req.body }; save(db); res.json(db.settings); });

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`Weekly POS running on http://localhost:${PORT}`));
