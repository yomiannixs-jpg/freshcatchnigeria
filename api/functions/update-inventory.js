
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase environment variables' }) };

    const { items } = JSON.parse(event.body || '{}');
    if (!Array.isArray(items) || !items.length) return { statusCode: 400, body: JSON.stringify({ error: 'items are required' }) };

    const results = [];
    for (const item of items) {
      const name = item.name || '';
      const qty = Number(item.qty || 0);
      if (!name || !qty) continue;

      const getRes = await fetch(`${supabaseUrl}/rest/v1/inventory?product_name=ilike.${encodeURIComponent(name)}&select=id,quantity&order=created_at.asc&limit=1`, {
        headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
      });
      const rows = await getRes.json().catch(() => []);
      if (Array.isArray(rows) && rows.length) {
        const row = rows[0];
        const newQty = Math.max(0, Number(row.quantity || 0) - qty);
        const patchRes = await fetch(`${supabaseUrl}/rest/v1/inventory?id=eq.${encodeURIComponent(row.id)}`, {
          method: 'PATCH',
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity: newQty, stock_status: newQty <= 0 ? 'out-of-stock' : (newQty < 5 ? 'low-stock' : 'in-stock') })
        });
        results.push({ product: name, ok: patchRes.ok, quantity: newQty });
      } else {
        results.push({ product: name, ok: false, skipped: true });
      }
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, results }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
