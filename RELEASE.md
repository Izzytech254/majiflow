# Release checklist

MajiFlow is a Next.js app with no database and no authentication. Orders are
stored as JSON on disk by `src/lib/server/order-store.ts`, so the checklist
below is about the order pipeline, not a migration.

## Before you tag a release

Run these in order and stop at the first failure:

```bash
corepack pnpm install --frozen-lockfile
npx tsc --noEmit
npx eslint src --ext .ts,.tsx
npx vitest run
npx next build
```

Typecheck first because it is the fastest way to catch a broken contract,
lint second, tests third, and the build last. `vitest run` uses a throwaway
directory (`MF_DATA_DIR`), so it never reads or writes the `.data` folder a
developer or a running server is using.

## Legal copy

The Terms of Service and Privacy Policy are versioned by a single date,
`LEGAL_UPDATED` in `src/lib/constants.ts`. Whenever either page's copy changes,
bump that constant so both pages show the same "Last updated" date, and keep the
two documents consistent with what the app actually does.

## Smoke test on the release candidate

Walk this path on a deployed build, on a phone-sized viewport:

1. Open the home page and a station page. The station only accepts orders
   inside its opening hours, so check the hours shown on the page match
   `src/lib/data/businesses.ts`.
2. Add two products to the cart from **two different stations** and open the
   cart. The delivery fee must be the sum of each station's own fee, and the
   free-delivery threshold must be judged per station, not on the combined
   subtotal.
3. Check out. The total charged must equal the total shown in the cart.
4. Confirm the order appears in the tracking page and in the station's
   dashboard, then move it through the vendor flow.
5. Open the station dashboard: analytics, customers, billing, products and
   settings must all show the real station record, with demo-only controls
   labelled as such.
6. Save a delivery address with the location picker and confirm the address
   fields are filled from the reverse geocode result.

## Known gaps

These are deliberate for this build and are labelled in the UI where a user
would notice them:

- **No payment provider.** Payment is simulated: M-Pesa-looking states are
  tracked, but no money moves. Do not present it as live.
- **No notification provider.** `notifyStatusChange` reports the gap once
  rather than pretending a message was sent.
- **No database and no auth.** Orders live in `.data/orders.json` on the
  deployment's local disk, so they are lost when the filesystem is replaced
  and are not shared between instances. Fine for a demo, not for production
  traffic.
- **Station data is seeded** in `src/lib/data/businesses.ts`, including
  opening hours and delivery fees.

## Configuration

All variables are optional. Without them the app runs, logs to stderr, and
reports the notification gap.

| Variable | Purpose |
| --- | --- |
| `MF_DATA_DIR` | Directory for `orders.json`. Defaults to `.data` in the repo. Set it to a mounted volume in production. |
| `MF_ALERT_WEBHOOK_URL` | Where order, payment, notification, store and geocode failures are POSTed. Without it, failures go to stderr only. |
| `MF_NOTIFY_WEBHOOK_URL` | Provider that sends order-status messages to customers. Without it, no message is sent. |

## Rolling back

The app is stateless apart from `orders.json`, so a rollback is a redeploy of
the previous build. Keep the data volume: an older build reads the same file
shape. If a release changes the shape of a stored order, read the file before
deploying the rollback so no orders are lost.
