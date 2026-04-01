exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase environment variables' }) };

    const body = JSON.parse(event.body || '{}');
    const { reference, name, phone, email, address, paymentMethod, items, total, status, paymentStatus, deliveryZone, deliveryFee } = body;
    if (!reference || !name || !phone || !address || !Array.isArray(items) || !items.length) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required order fields' }) };
    }

    const existingRes = await fetch(`${supabaseUrl}/rest/v1/orders?reference=eq.${encodeURIComponent(reference)}&select=id,reference`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    });
    const existing = await existingRes.json().catch(() => []);
    if (Array.isArray(existing) && existing.length) return { statusCode: 200, body: JSON.stringify({ ok: true, reference, existing: true }) };

    const payload = {
      reference,
      customer_name: name,
      customer_phone: phone,
      customer_email: email || '',
      delivery_address: address,
      delivery_zone: deliveryZone || '',
      delivery_fee: Number(deliveryFee || 0),
      payment_method: paymentMethod || 'whatsapp',
      payment_status: paymentStatus || 'pending',
      amount_ngn: Number(total || 0),
      items,
      status: status || 'pending'
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { statusCode: res.status, body: JSON.stringify({ error: 'Could not create order', detail: data }) };
    return { statusCode: 200, body: JSON.stringify({ ok: true, reference, order: data }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
