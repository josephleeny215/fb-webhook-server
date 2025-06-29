const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // ADD THIS
const app = express();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'sigmaHippo';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || 'EAAq9ZAHcxI3MBO5yga8d8rJCUWYpU10iVtq0trhG2aExoZAvzZCcM3BAzVRHgqOeMfCZBlRAW0YREHnGzr7f5pK8ZBWYsIaVZAOYXXas8CWr2IpC20JZAGL4wlj7eerQwGLCKDWfum3ibqGydZCRRdTKZCHbKhkAjKX4CXguDTb8ppVFo4QNbV1ZAI37HLzl5lIdC40pbA7sZAqjg6S5L9KnIZAtYFPjZAAZDZD';

app.use(cors());
app.use(bodyParser.json());

// Facebook webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Facebook sends messages here
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const webhookEvent = entry.messaging[0];
      const senderId = webhookEvent.sender.id;

      if (webhookEvent.message && webhookEvent.message.text) {
        const userMessage = webhookEvent.message.text;

        console.log(`Received from ${senderId}: ${userMessage}`);

        // STEP 1: Generate basic reply
        const replyText = `Hey! Judah here. You said: "${userMessage}"`;

        // STEP 2: Send it back to the user
        const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${EAAq9ZAHcxI3MBO5yga8d8rJCUWYpU10iVtq0trhG2aExoZAvzZCcM3BAzVRHgqOeMfCZBlRAW0YREHnGzr7f5pK8ZBWYsIaVZAOYXXas8CWr2IpC20JZAGL4wlj7eerQwGLCKDWfum3ibqGydZCRRdTKZCHbKhkAjKX4CXguDTb8ppVFo4QNbV1ZAI37HLzl5lIdC40pbA7sZAqjg6S5L9KnIZAtYFPjZAAZDZD}`;
        const payload = {
          recipient: { id: senderId },
          message: { text: replyText }
        };

        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => console.log('Response sent:', data))
        .catch(err => console.error('Error:', err));
      }
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});
