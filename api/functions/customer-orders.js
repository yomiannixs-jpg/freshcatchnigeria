
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase environment variables' }) };

    const phone = event.queryStringParameters?.phone || '';
    const email = event.queryStringParameters?.email || '';
    if (!phone && !email) return { statusCode: 400, body: JSON.stringify({ error: 'phone or email is required' }) };

    let query = `${supabaseUrl}/rest/v1/orders?select=*&order=created_at.desc`;
    if (phone) query += `&customer_phone=eq.${encodeURIComponent(phone)}`;
    else query += `&customer_email=eq.${encodeURIComponent(email)}`;

    const res = await fetch(query, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    });
    const data = await res.json().catch(() => []);
    return { statusCode: res.status, body: JSON.stringify({ orders: data || [] }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
