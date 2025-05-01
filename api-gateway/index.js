const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const Consul = require('consul');

const PORT = process.env.PORT || 3000;
const app = express();
const consul = new Consul({ promisify: true });

async function getTarget(name) {
  const nodes = await consul.catalog.service.nodes(name);
  if (!nodes.length) throw new Error(`No instances for ${name}`);
  const svc = nodes[0];
  return `http://${svc.Address}:${svc.ServicePort}`;
}

// Proxy endpoints
app.use(
  '/api/a',
  createProxyMiddleware({
    router: async () => await getTarget('service-a'),
    pathRewrite: { '^/api/a': '' }
  })
);

app.use(
  '/api/b',
  createProxyMiddleware({
    router: async () => await getTarget('service-b'),
    pathRewrite: { '^/api/b': '' }
  })
);

app.listen(PORT, () => console.log(`API Gateway listening on ${PORT}`));