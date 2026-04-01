
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { reference, email, amount, metadata, callback_url } = JSON.parse(event.body || '{}');
    if (!reference || !email || !amount) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Reference, email and amount are required' }) };
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!secret) return { statusCode: 500, body: JSON.stringify({ error: 'Missing PAYSTACK_SECRET_KEY' }) };
    if (!supabaseUrl || !serviceKey) return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase env vars' }) };

    
    const orderPatch = await fetch(`${supabaseUrl}/rest/v1/orders?reference=eq.${encodeURIComponent(reference)}`, {
      method: 'PATCH',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer_name: metadata?.name || '',
        customer_phone: metadata?.phone || '',
        customer_email: email,
        delivery_address: metadata?.address || '',
        payment_method: 'paystack',
        amount_ngn: amount,
        items: metadata?.items || [],
        status: 'payment-initialized'
      })
    });

    if (!orderPatch.ok) {
      const t = await orderPatch.text();
      return { statusCode: 500, body: JSON.stringify({ error: 'Could not prepare order for payment', detail: t }) };
    }

const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: Math.round(Number(amount) * 100),
        reference,
        callback_url,
        metadata
      })
    });

    const data = await response.json();
    if (!response.ok || !data.status) {
      return { statusCode: 400, body: JSON.stringify({ error: data.message || 'Paystack initialize failed' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference
      })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
