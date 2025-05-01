const Consul = require('consul');
const { v4: uuidv4 } = require('uuid');

const consul = new Consul({
    host: 'localhost', port: '8500', promisify: true
})


async function registerService(name, port) {
    const id = `${name}-${uuidv4()}`;
    await consul.agent.service.register({
      id,
      name,
      address: 'localhost',
      port,
      check: { ttl: '10s', deregister_critical_service_after: '1m' }
    });
    console.log(`Registered ${name} with ID ${id}`);
    setInterval(() => {
      consul.agent.check.pass({ id: `service:${id}` }).catch(console.error);
    }, 5000);
  }
  
  async function deregisterService(id) {
    await consul.agent.service.deregister(id);
    console.log(`Deregistered service with ID ${id}`);
  }
  module.exports = { registerService, consul ,deregisterService};
