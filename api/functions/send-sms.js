
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  try {
    const { phone, message } = JSON.parse(event.body || '{}');
    if (!phone || !message) return { statusCode: 400, body: JSON.stringify({ error: 'phone and message are required' }) };

    const apiKey = process.env.TERMII_API_KEY;
    const from = process.env.TERMII_SENDER_ID || 'FreshCatch';
    if (!apiKey) {
      return { statusCode: 200, body: JSON.stringify({ ok: false, skipped: true, reason: 'TERMII_API_KEY not set' }) };
    }

    const res = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: phone,
        from,
        sms: message,
        type: 'plain',
        channel: 'generic',
        api_key: apiKey
      })
    });
    const data = await res.json().catch(() => ({}));
    return { statusCode: res.ok ? 200 : res.status, body: JSON.stringify({ ok: res.ok, provider: 'termii', data }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
