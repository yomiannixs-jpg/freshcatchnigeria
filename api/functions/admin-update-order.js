
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  try {
    const body = JSON.parse(event.body || '{}');
    const { reference, id, status, rider_id, payment_status } = body;
    if (!reference && !id) return { statusCode: 400, body: JSON.stringify({ error: 'Reference or id is required' }) };

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const termiiKey = process.env.TERMII_API_KEY;
    const sender = process.env.TERMII_SENDER_ID || 'FreshCatch';
    if (!supabaseUrl || !serviceKey) return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase environment variables' }) };

    const patch = {};
    if (status) patch.status = status;
    if (typeof rider_id !== 'undefined') patch.rider_id = rider_id || null;
    if (payment_status) patch.payment_status = payment_status;
    patch.updated_at = new Date().toISOString();

    if (status === 'packed') patch.packed_at = new Date().toISOString();
    if (status === 'assigned') patch.assigned_at = new Date().toISOString();
    if (status === 'out-for-delivery') patch.out_for_delivery_at = new Date().toISOString();
    if (status === 'delivered') patch.delivered_at = new Date().toISOString();
    if (status === 'cancelled') patch.cancelled_at = new Date().toISOString();

    const query = reference ? `reference=eq.${encodeURIComponent(reference)}` : `id=eq.${encodeURIComponent(id)}`;
    const res = await fetch(`${supabaseUrl}/rest/v1/orders?${query}`, {
      method: 'PATCH',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patch)
    });

    if (!res.ok) {
      const txt = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: txt || 'Update failed' }) };
    }

    if (reference && termiiKey && status) {
      const getRes = await fetch(`${supabaseUrl}/rest/v1/orders?reference=eq.${encodeURIComponent(reference)}&select=customer_phone,reference,status&limit=1`, {
        headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
      });
      const rows = await getRes.json().catch(() => []);
      const row = Array.isArray(rows) && rows.length ? rows[0] : null;
      if (row?.customer_phone) {
        await fetch('https://api.ng.termii.com/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: row.customer_phone,
            from: sender,
            sms: `FreshCatch NG: your order ${row.reference} is now ${status}.`,
            type: 'plain',
            channel: 'generic',
            api_key: termiiKey
          })
        }).catch(() => {});
      }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, ...patch }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
