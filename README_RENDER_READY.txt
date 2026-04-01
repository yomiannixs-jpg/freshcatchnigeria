FreshCatch NG attached-folder Render package

This package was rebuilt from the attached folder and fixed for Render deployment.

Key fixes:
- converted app to Render Web Service with Express server
- added server-side JWT validation for admin API routes
- fixed hidden-content issue from fade-up class when JS fails
- added fallback hero image asset
- added fallback product image handling so missing fish assets do not break the storefront
- copied Netlify-style functions into a Render-compatible setup
- kept admin, rider portal, tracking, vendor/rider/inventory features

Deploy:
1. Push this folder to GitHub.
2. Create a Render Web Service from the repo.
3. Add environment variables:
   PAYSTACK_SECRET_KEY
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   SUPABASE_ANON_KEY
   ADMIN_EMAILS
4. Update config.js with your Supabase public URL and anon key.
5. Run supabase/schema.sql in your Supabase SQL editor.
6. Redeploy and test:
   /
   /admin-login.html
   /admin.html
   /track.html
   /rider-portal.html

Use Render Web Service, not Render Static Site.
