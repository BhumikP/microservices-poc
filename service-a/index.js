const express = require("express");
const axios = require("axios");
const { registerService, consul } = require("common");

const PORT =
  process.env.PORT ||
  3001;
  
  (async () => {
    // reister service with node id "service-a"
    await registerService("service-a", PORT);
    const app = express();
    app.use(express.json());
    // Health endpoint
    app.get("/health", (_req, res) => res.send("OK"));

    // Service A endpoint
    app.get("/serviceA", (_req, res) => {
      res.json({ message: "Hello from Service A" });
    });

    // Call Service B via HTTP + Consul discovery
    app.get("/call-serviceB", async (_req, res) => {
      try {
        console.log("Calling Service B");
        const nodes = await consul.catalog.service.nodes("service-b");
        console.log(nodes);
        if (!nodes.length)
          return res.status(503).json({ error: "No service-b instances" });
        const target = nodes[0];
        const url = `http://${target.Address}:${target.ServicePort}/serviceB`;
        const response = await axios.get(url);
        res.json({ fromServiceB: response.data });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.listen(PORT, () => console.log(`Service A listening on ${PORT}`));
  })();
