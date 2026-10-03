# WalletMandu frontend

Responsive React storefront. Administration lives in the separate `../admin` repository.
The original `landingpage (1).html` is preserved as a reference.

## Run locally

```sh
# From the repository root
npm install --prefix frontend
npm run dev --prefix frontend
```

Open http://localhost:5173 for the storefront. Set `VITE_ADMIN_URL` to the admin app URL (defaults to http://localhost:5174). Development uses the backend target configured in `.env.development`.

Production builds use `https://walletxmandu.onrender.com/api` directly, configured
in `.env.production`. The hosted backend must allow the deployed frontend's origin
through CORS. Restart Vite after changing development environment settings; rebuild
the frontend after changing production settings.

To use a local backend instead, create `frontend/.env.development.local` with
`API_PROXY_TARGET=http://127.0.0.1:3001` (use your backend's configured port), then
run `npm run start:dev` in a separate terminal.

The storefront reads `/api/products` and `/api/category`. If the API cannot be
reached, it explicitly labels the reference collection and NPR prices as previews.
An empty live catalog stays empty. Product images come from `coverImageUrl`; local
wallet illustrations replace missing images. Prices from the API are treated as
NPR; sample prices are placeholders, not converted USD prices.

## Admin access

See `../admin/README.md` for setup, cookie sessions, and product/category management. The storefront no longer includes an admin dashboard.

## Components and formatting

- `pages/Storefront.jsx`: catalog loading, filters, search, sorting, and bag state.
- `components/`: shared header, brand, wallet visuals, product cards, dialog, and bag.
- `api.js`: requests, API errors, timeouts, and NPR formatting.
- `data.js`: sample catalog retained from the original concept.
- `styles.css`: storefront, admin, and mobile layouts.

JSX uses two-space indentation, single quotes, and one prop per line on elements
with multiple props. Run `npm run format --prefix frontend` to keep it consistent.

## Build and verify

```sh
npm run build --prefix frontend
npm run format:check --prefix frontend
npx --prefix frontend playwright install chromium
npm test --prefix frontend
```

Browser tests mock the API to cover catalog/bag interactions, mobile layout, and
featured image display without touching real store data. Admin tests live in `../admin/tests`.

Deploy `frontend/dist` as a static app with history fallback to `index.html` so
storefront routes load directly. Proxy `/api` to NestJS, or set `VITE_API_URL` at build time
and configure the backend's `CORS_ORIGIN` for the frontend origin.

The bag is saved on the current browser. Checkout, order submission, payments, and
newsletter subscription are not connected: the existing API has no such endpoints.
