
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase environment variables' }) };
    }

    const body = JSON.parse(event.body || '{}');
    const { rider_id, status, lat, lng } = body;

    if (!rider_id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'rider_id is required' }) };
    }
    if (lat == null || lng == null) {
      return { statusCode: 400, body: JSON.stringify({ error: 'lat and lng are required' }) };
    }

    const checkRes = await fetch(`${supabaseUrl}/rest/v1/riders?id=eq.${encodeURIComponent(rider_id)}&select=id,name`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });
    const riders = await checkRes.json().catch(() => []);
    if (!Array.isArray(riders) || !riders.length) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Rider not found. Create the rider first in Admin or Supabase.' }) };
    }

    const patchRes = await fetch(`${supabaseUrl}/rest/v1/riders?id=eq.${encodeURIComponent(rider_id)}`, {
      method: 'PATCH',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: status || 'busy',
        lat: Number(lat),
        lng: Number(lng),
        last_seen: new Date().toISOString()
      })
    });

    if (!patchRes.ok) {
      const detail = await patchRes.text();
      return { statusCode: patchRes.status, body: JSON.stringify({ error: 'Could not update rider location', detail }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, rider_id, status: status || 'busy' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
