const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'sigmaHippo';

app.use(bodyParser.json());

 Facebook webhook verification
app.get('webhook', (req, res) = {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

 Facebook sends message events here
app.post('webhook', (req, res) = {
  console.log('Incoming webhook', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT  3000;
app.listen(PORT, () = console.log(`Webhook server listening on port ${PORT}`));
