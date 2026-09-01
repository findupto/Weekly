# MK Pizza & Ice Bar POS

Complete restaurant POS/control center for **MK Pizza & Ice Bar**, Abbas Chowk Collage Road Bhakkar, **0316 9700025**. Currency: **Rs**. Tax: **0** by default.

## Modules
- **Menu / Products:** add, edit, deactivate/delete, search, variants, select-all, bulk actions, CSV download/upload.
- **Combos / Deals:** combo price plus component items. Components are retained in the sales ledger so an owner can analyze the underlying items sold through deals.
- **Sales:** dine-in, takeaway, delivery, online and waiter orders with complete status history.
- **Riders:** rider records and delivery assignment support.
- **Staff:** role-based accounts.
- **Expenses / Accounts:** operational expense and account records.
- **Customers / Suppliers:** master records for repeat customers, vendors and purchasing.
- **Demands:** purchase/request records with quantity and unit; useful for weekly purchasing analysis.
- **Purchases:** purchase receipt increases stock and records supplier/cost.
- **Inventory:** stock adjustments and movement history.
- **Production/Yield:** raw-material input, usable output, processing loss and loss percentage.
- **Analytics:** separate item/variant sales ledger and demand summaries.

## Exact item tracking
Every sellable variant has its own ledger key. Examples:
- Pizza: Small, Medium, Large, XL
- Shawarma: Small, Medium, Large
- Burger: Special, Chicken, Zinger
- Biryani: Half, Full
- Ice Cream: 1 Scoop, 2 Scoops
- Tea, Coffee, Shakes and other standard products

When a combo/deal is sold, the order keeps the combo sale and its component list. When the order becomes **Paid/Closed**, both the sale and component quantities can be reported separately.

## Raw material processing example
If you buy **100 kg meat** and processing produces **70 kg usable meat**, record a production yield:
- Input = 100 kg
- Usable output = 70 kg
- Processing loss = 30 kg
- Loss rate = 30%

For costing, use the usable 70 kg as the processed-material output and keep the 30 kg loss visible instead of hiding it. A production recipe/BOM can later consume the processed meat against pizzas, burgers, shawarma, etc.

## Order workflow and permissions
**Customer/Waiter → Pending → Admin authorization → Kitchen → Preparing → Ready → Cashier payment → Closed.**

- **Admin:** full control; authorizes orders, manages menu, combos, staff, riders, customers, suppliers, purchasing, demands, expenses, accounts, inventory, settings and analytics.
- **Waiter:** creates orders and views own orders; cannot authorize/send directly to kitchen.
- **Kitchen:** only sees kitchen work and can start/complete preparation.
- **Cashier:** handles ready orders, payment and closing; no menu or admin controls.
- **Customer:** public online ordering only; no POS administration access.
- **Rider:** should receive only assigned delivery/customer/order information; no sales, inventory or staff access.

## Mobile APK architecture
The APK is a client, not the database. Recommended production setup:

`Customer APK / Waiter APK / Kitchen APK / Rider APK → HTTPS API → Central POS Server + Database`

Each mobile login receives a role-based JWT. The server enforces permissions, so hiding a button in the APK is not the security boundary. The same API can also serve the Windows POS and web ordering site.

### Suggested APK screens
- **Customer:** menu, variants, cart, address, order, order status, order history.
- **Waiter:** tables, menu, variants, cart, submit order, own-order status.
- **Kitchen:** incoming tickets, queue, start, ready, notes.
- **Rider:** assigned deliveries, customer address/phone, picked-up, delivered.
- **Admin/Cashier:** use the full POS/web/Windows control center rather than giving every mobile user admin access.

## API highlights
- `POST /api/online/orders` — public online order intake
- `POST /api/orders` — waiter/admin order creation
- `POST /api/orders/:id/status` — controlled workflow transitions
- `/api/products` — menu/product CRUD and bulk import/export
- `/api/combos` — combo/deal management
- `/api/riders`, `/api/users`, `/api/customers`, `/api/suppliers`
- `/api/demands`, `/api/purchases`, `/api/purchases/receive`
- `/api/expenses`, `/api/accounts`
- `/api/analytics/items`, `/api/analytics/sales`, `/api/analytics/demands`, `/api/analytics/yield`
- `/api/production/yield` — raw-to-usable material conversion

## Build
```bash
npm install
npm start
```
Windows installer/portable EXE: `npm run dist:win`.
Android build is provided through Capacitor/GitHub Actions.

## Production security
Set a strong `JWT_SECRET`, use HTTPS, change all default passwords, hash passwords instead of storing plaintext, add database transactions/locking, and use PostgreSQL/MySQL for multi-device production. The included JSON persistence is a development/small-installation data store, not the final recommended production database.
