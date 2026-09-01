# Weekly POS

A lightweight retail POS with a responsive cashier interface and a REST API designed for Android/iOS/mobile apps.

## Run

```bash
npm install
POS_API_KEY=your-secret-key npm start
```

Open `http://localhost:3000`.

The app stores data in `data.json` so it can run without a database for an initial deployment. For production, move the same API contract to PostgreSQL/MySQL and add proper user authentication.

## Mobile app connection

The mobile app can use the same server URL. Send the API key in `x-api-key` for protected operations.

- `GET /api/health` — health check
- `GET /api/products?q=milk` — product catalog (public read)
- `POST /api/products` — create product
- `PATCH /api/products/:id` — update product/stock
- `GET /api/orders` — recent orders
- `POST /api/orders` — create/complete sale
- `GET /api/dashboard` — dashboard totals
- `GET /api/settings` — store settings
- `PUT /api/settings` — update settings

### Create sale

```http
POST /api/orders
x-api-key: your-secret-key
Content-Type: application/json

{
  "items": [{ "productId": "p1", "qty": 2 }],
  "paymentMethod": "cash",
  "customer": { "name": "Walk-in" }
}
```

The server validates stock, calculates totals from server-side prices, deducts inventory, and returns the completed order. This keeps the mobile client from being the source of truth for prices or stock.

## Suggested mobile architecture

`Mobile App → HTTPS REST API → POS Server → Database`

For deployment, set `POS_API_KEY` to a strong secret, put the API behind HTTPS, and replace the simple API-key authentication with per-user JWT/session authentication when multiple staff accounts are needed.
