FreshCatch NG payment-optimized build

Improvements:
- orders are now created BEFORE checkout starts
- WhatsApp and Paystack flows both create an order reference
- Paystack init updates an existing order instead of trying to insert a duplicate
- payment-success.html added
- supabase/schema.sql added and aligned to app code

After deploy:
1. Run supabase/schema.sql
2. Set Render env vars:
   PAYSTACK_SECRET_KEY
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   SUPABASE_ANON_KEY
   ADMIN_EMAILS
3. Update config.js with real Supabase URL and publishable key
4. Deploy on Render Web Service
