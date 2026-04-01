FreshCatch NG Render fixed package

Fixed in this build:
- fish images mapped automatically from uploaded fish zip
- different products now use different fish images
- cart logic fixed
- checkout function fixed
- frontend API calls updated to /api/*
- Render-native server included

Deploy on Render Web Service.
Then set:
PAYSTACK_SECRET_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY
ADMIN_EMAILS

Also update config.js with your Supabase URL and publishable key.
