
async function requestSupabase(path, options = {}) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return { ok:false, status:500, json: async () => ({ error: 'Missing Supabase environment variables' }) };
  }
  return fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
}
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  try {
    const { rider_id, status, lat, lng } = JSON.parse(event.body || '{}');
    if (!rider_id || lat == null || lng == null) {
      return { statusCode: 400, body: JSON.stringify({ error: 'rider_id, lat and lng are required' }) };
    }
    const res = await requestSupabase(`riders?id=eq.${encodeURIComponent(rider_id)}`, {
      method:'PATCH',
      body: JSON.stringify({
        status: status || 'busy',
        lat,
        lng,
        last_seen: new Date().toISOString()
      })
    });
    return { statusCode: res.status, body: JSON.stringify({ ok: res.ok, rider_id }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
