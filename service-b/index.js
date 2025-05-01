const express = require('express');
const { registerService } = require('common');

const PORT = process.env.PORT || 3002;

(async () => {
  await registerService('service-b', PORT);
  const app = express();

  // Health endpoint
  app.get('/health', (_req, res) => res.send('OK'));

  // Service B endpoint
  app.get('/serviceB', (_req, res) => {
    res.json({ message: 'Hello from Service B' });
  });

  app.listen(PORT, () => console.log(`Service B listening on ${PORT}`));
})();