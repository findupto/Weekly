# MK Pizza & Ice Bar POS

Restaurant-wide POS/control center for **MK Pizza & Ice Bar**, Abbas Chowk Collage Road Bhakkar, **0316 9700025**. Currency: **Rs**. Tax: **0** by default.

## Complete operating modules
- Menu/products, categories, SKUs, units and variants
- Select-all, bulk delete/deactivate, CSV upload and CSV download
- Combos/deals with component-item tracking
- Recipes/BOM for automatic ingredient consumption
- Orders: dine-in, takeaway, delivery, waiter and online
- Kitchen display workflow and order history
- Riders and delivery workflow
- Staff and role permissions
- Customers and suppliers
- Demands and demand analysis
- Purchasing and stock receiving
- Inventory and stock movement history
- Production/yield and processing loss
- Wastage records
- Expenses and accounts
- Item/variant sales analytics
- Audit trail
- Company settings

## Item-level tracking
The sales ledger is designed to distinguish variants such as:

- Pizza: Small / Medium / Large / XL
- Shawarma: Small / Medium / Large
- Burger: Special / Chicken / Zinger
- Biryani: Half / Full
- Ice Cream: 1 Scoop / 2 Scoops
- Tea / Coffee / Shakes and every future variant

A combo/deal remains visible as the customer-facing sale while its component quantities can be recorded separately for demand, stock and analytics.

## Automatic restaurant flow
`Customer / Waiter → Admin Authorization → Kitchen → Preparing → Ready → Cashier → Paid → Closed`

Authorization is the control point. Stock/recipe consumption and the sales ledger are tied to the order lifecycle so the same sale does not need to be entered again in inventory or reports.

## Meat/production yield
Example:

`100 kg raw meat → 70 kg usable meat + 30 kg processing loss`

Record input, output, loss and yield percentage. The processed output can then be used as an inventory item consumed by recipes. This keeps purchasing, production, wastage and recipe costing traceable.

## Roles
**Admin:** full control and approvals.

**Waiter:** create orders and view permitted orders; cannot authorize kitchen release.

**Kitchen:** kitchen queue, start preparation, mark ready; no accounts or menu administration.

**Cashier:** ready orders, payment and closing; no admin configuration.

**Rider:** assigned deliveries and delivery status only.

**Customer:** public online ordering and order status only.

Server-side authorization is the security boundary; mobile UI restrictions are not relied upon for security.

## Online ordering
A public customer page is available at `/order.html` after the server is deployed. It loads the live menu and submits orders to `POST /api/online/orders`, where they enter the pending/admin-authorization queue.

## Mobile APK architecture
The APK should be a role-specific client connected to the same central API:

`Customer APK / Waiter APK / Kitchen APK / Rider APK → HTTPS API → Central POS Server + Database`

Recommended permissions:

- **Customer:** browse menu, select variants, cart, address/contact, place order, track own order.
- **Waiter:** tables, menu, variants, create/submit orders, see own order status.
- **Kitchen:** assigned kitchen tickets, preparation status and notes.
- **Rider:** assigned delivery, customer delivery information, picked-up/delivered status.

Each user authenticates to the API and receives a role-limited token. The Windows POS and APKs can therefore operate on the same live restaurant data.

## Important production architecture
The current repository keeps a JSON data store for easy setup and demonstration. For a real multi-device restaurant deployment, use **PostgreSQL/MySQL with database transactions and row locking**. This is important when several waiters, kitchen devices, cashier and online customers operate simultaneously.

Also configure:
- HTTPS
- strong `JWT_SECRET`
- hashed passwords
- automated backups
- database transaction/locking
- device/session management
- audit retention
- printer/payment integrations as required

## Run
```bash
npm install
npm start
```
Windows installer/portable EXE:
```bash
npm run dist:win
```
Android/Capacitor build is included in the project configuration and CI workflow.

## Default demo users
- admin / admin123
- waiter / waiter123
- kitchen / kitchen123
- cashier / cashier123

Change these credentials before production.