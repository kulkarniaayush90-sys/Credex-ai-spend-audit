# Reflection

## What Worked Well

- Separating deterministic calculations from AI copy generation keeps the product credible.
- The fixed tool list makes the UX faster and the pricing logic easier to test.
- A memory fallback for storage lets the app remain usable in local development even without live Supabase credentials.

## Tradeoffs

- The pricing dataset is intentionally opinionated rather than exhaustive. That keeps the MVP understandable, but it will need refinement as real user data arrives.
- The public report path is privacy-safe, but persistence depends on Supabase in production.
- The current UI uses lightweight custom primitives instead of a full shadcn install flow, which keeps the repo self-contained but means a future design-system pass could improve consistency further.

