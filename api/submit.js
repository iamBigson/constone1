// api/submit.js
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      age,
      location,
      email,
      telegram,
      amount,
      story,
      terms,
      ageConfirm,
      timestamp
    } = req.body;

    // Basic validation
    if (!name || !email || !story) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format the message for Telegram
    const message = `
🔔 **New Cornerstone Application**

**Name:** ${name}
**Age:** ${age}
**Location:** ${location}
**Email:** ${email}
**Telegram:** ${telegram || 'Not provided'}
**Amount:** ${amount}

**Story:**
${story}

**Terms agreed:** ${terms ? '✅' : '❌'}
**18+ confirmed:** ${ageConfirm ? '✅' : '❌'}
**Submitted:** ${new Date(timestamp).toLocaleString()}
    `;

    // Send to Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Missing Telegram credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      throw new Error('Telegram API error');
    }

    // Success!
    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({ error: 'Failed to send application' });
  }
}
