
exports.handler = async (event) => {
  try {
    const reference = event.queryStringParameters?.reference;
    if (!reference) return { statusCode: 400, body: JSON.stringify({ error: 'Missing reference' }) };

    const secret = process.env.PAYSTACK_SECRET_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const termiiKey = process.env.TERMII_API_KEY;
    const sender = process.env.TERMII_SENDER_ID || 'FreshCatch';

    if (!secret) return { statusCode: 500, body: JSON.stringify({ error: 'Missing PAYSTACK_SECRET_KEY' }) };
    if (!supabaseUrl || !serviceKey) return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase env vars' }) };

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { 'Authorization': `Bearer ${secret}` }
    });
    const data = await response.json();

    if (response.ok && data.status) {
      const mappedStatus = data.data.status === 'success' ? 'paid' : data.data.status;
      await fetch(`${supabaseUrl}/rest/v1/orders?reference=eq.${encodeURIComponent(reference)}`, {
        method: 'PATCH',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: mappedStatus === 'paid' ? 'confirmed' : mappedStatus,
          payment_status: mappedStatus,
          paystack_reference: reference
        })
      });
    }

    if (response.ok && data.status && termiiKey) {
      const getRes = await fetch(`${supabaseUrl}/rest/v1/orders?reference=eq.${encodeURIComponent(reference)}&select=customer_phone,reference&limit=1`, {
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
            sms: `FreshCatch NG: payment confirmed for order ${reference}.`,
            type: 'plain',
            channel: 'generic',
            api_key: termiiKey
          })
        }).catch(() => {});
      }
    }

    return { statusCode: response.status, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
