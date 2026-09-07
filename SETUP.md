# Template setup

The public site works immediately with the four example destinations. Persistent editing requires a free Supabase project; the built site remains a static frontend and can be hosted on Vercel's free tier.

1. Create a Supabase project and run `supabase/schema.sql` in its SQL editor.
2. In **Authentication > Users**, create the one owner account. Disable public signup in the authentication settings.
3. Run the final commented `site_admins` insert from `supabase/schema.sql`, replacing the owner email.
4. Add the production domain and `http://localhost:5173` to Supabase Auth's allowed redirect URLs.
5. Copy `.env.example` to `.env.local` and supply the project URL and publishable key.
6. Add those same two variables to the Vercel project's environment variables, then deploy.

The publishable key is intentionally safe to expose in frontend code. Authorization is enforced in Postgres by row-level security; never place the Supabase service-role key in this project or in a `VITE_` variable.

The subdued `login` control is in the bottom-right corner. After the owner follows the emailed magic link, a `+` appears among the destinations and opens the editor. The editor includes the reusable custom icon bank and the playing-media URL. Signed-out visitors never receive write permission and never see the `+`.
