
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
  try {
    if (event.httpMethod === 'GET') {
      const res = await requestSupabase('inventory?select=*,vendors(name)&order=created_at.desc');
      const data = await res.json();
      const inventory = (data || []).map(row => ({ ...row, vendor_name: row.vendors?.name || '' }));
      return { statusCode: res.status, body: JSON.stringify({ inventory }) };
    }
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const res = await requestSupabase('inventory', { method:'POST', body: JSON.stringify(body), headers: { Prefer:'return=representation' } });
      const data = await res.json();
      return { statusCode: res.status, body: JSON.stringify({ inventory: data }) };
    }
    if (event.httpMethod === 'DELETE') {
      const { id } = JSON.parse(event.body || '{}');
      const res = await requestSupabase(`inventory?id=eq.${encodeURIComponent(id)}`, { method:'DELETE' });
      return { statusCode: res.status, body: JSON.stringify({ ok: res.ok }) };
    }
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
