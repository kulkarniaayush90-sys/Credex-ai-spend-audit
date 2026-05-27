# Deployment

## Vercel

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add the environment variables from `.env.example`.
4. Set the production `NEXT_PUBLIC_APP_URL`.
5. Deploy the main branch.

## Supabase

1. Create a new project.
2. Run `supabase/schema.sql`.
3. Optionally seed `supabase/seed.sql`.
4. Set the service role key in Vercel and local development.

## Notes

- The app degrades gracefully if Anthropic, Resend, or Supabase are missing during local development.
- Production should always configure Supabase and Resend before launch.

