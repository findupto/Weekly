# MK Pizza & Ice Bar POS

Role-based POS for **MK Pizza & Ice Bar**, Abbas Chowk Collage Road Bhakkar, 0316 9700025. Currency: **Rs**. Tax: **0** by default.

## Staff controls
- **Admin:** authorizes waiter/online orders, sends tickets to kitchen, manages products/settings and monitors sales.
- **Waiter:** creates dine-in, takeaway and delivery orders; cannot send directly to kitchen.
- **Kitchen:** sees authorized kitchen tickets, starts making and marks orders ready.
- **Cashier:** sees ready orders, collects payment and closes orders.
- **Online customer:** places orders through the public online-order API; orders enter `pending` and require Admin authorization.

Workflow: **Waiter / Online → Admin Authorization → Kitchen → Preparing → Ready → Cashier Payment → Closed**.

## Default accounts
Change these before production:
- admin / admin123
- waiter / waiter123
- kitchen / kitchen123
- cashier / cashier123

## Web POS
```bash
npm install
npm start
```
Open `http://localhost:3000`.

## Windows EXE
`npm run dist:win` builds an installable Windows NSIS installer and a portable Windows executable. GitHub Actions also builds these artifacts.

## Android APK
Capacitor configuration is included. The GitHub Actions workflow builds an Android APK artifact. For real online ordering, deploy the server behind HTTPS and configure the mobile client to use the public server URL.

## Online ordering API
`POST /api/online/orders` accepts items, customer, table, order type, payment method and note. It creates a `pending` order for Admin review.

## Production
Set a strong `JWT_SECRET`, use HTTPS, replace default staff passwords, and move persistence from `data.json` to PostgreSQL/MySQL before a multi-device production deployment.
