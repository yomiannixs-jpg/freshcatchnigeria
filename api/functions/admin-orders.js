
exports.handler = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase environment variables' }) };
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/orders?select=*&order=created_at.desc`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });

    const data = await res.json();
    return { statusCode: res.status, body: JSON.stringify({ orders: data }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
