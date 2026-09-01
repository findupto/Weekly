CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','manager','waiter','kitchen','cashier','rider','inventory','accountant')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY,
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  category text,
  unit text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric(14,2) NOT NULL DEFAULT 0,
  UNIQUE(product_id,name)
);
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY,
  number text UNIQUE NOT NULL,
  status text NOT NULL,
  order_type text NOT NULL,
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  tax numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
  unit_price numeric(14,2) NOT NULL DEFAULT 0,
  source text NOT NULL DEFAULT 'single'
);
CREATE TABLE IF NOT EXISTS inventory_movements (
  id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity numeric(14,3) NOT NULL,
  movement_type text NOT NULL,
  reference_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_log (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  resource text,
  resource_id text,
  ip inet,
  user_agent text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_time ON inventory_movements(product_id,created_at);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_log(created_at);
