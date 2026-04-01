FreshCatch NG rider backend fix

What was fixed:
- rider GPS no longer requires an admin bearer token
- added public endpoint: /api/rider-location
- rider portal now updates public.riders directly through the backend
- clearer rider ID instructions added

How to use:
1. Create a rider in Admin -> Riders
2. Copy the rider id from Admin or Supabase
3. Open rider-portal.html?rider_id=<UUID>
4. Tap Start sharing

Important:
If you type '12' or another short number, it will fail because Rider IDs are UUIDs, not small numbers.
