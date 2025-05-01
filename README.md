
**How to run demo:**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/BhumikP/microservices-poc.git
   cd microservices-poc
   ```
2. **Install prerequisites:** ensure you have:
   - Docker (v20+) and Docker Compose (v1.29+) installed.
   - (Optional) Consul CLI if you want to interact with the Consul agent locally (e.g., `brew install consul` on macOS, `apt-get install consul` on Debian/Ubuntu, or download from https://www.consul.io/downloads).
3. **Start all services:**
   ```bash
   docker-compose up --build -d
   ```
   - Containers will start for Consul, Service A, Service B, and the Gateway.
4. **Verify running containers:**
   ```bash
   docker-compose ps
   ```
   You should see services named `consul`, `service-a`, `service-b`, and `gateway` in the `Up` state.
5. **Access Consul UI:**
   Open your browser to http://localhost:8500 and check that `service-a` and `service-b` are registered under **Services**.
6. **View logs in real time:**
   ```bash
   docker-compose logs -f
   ```
7. **Test service endpoints:**
   ```bash
   curl http://localhost:3001/health           # Service A health check
   curl http://localhost:3000/api/a/serviceA   # Service A via API Gateway
   curl http://localhost:3000/api/a/call-serviceB # Service A calling Service B
   curl http://localhost:3002/health           # Service B health check
   curl http://localhost:3000/api/b/serviceB   # Service B via API Gateway
   ```


**Components:**

Consul: Service registry and health checker

Service A: Express service exposing /serviceA and discovering Service B via Consul

Service B: Express service exposing /serviceB

API Gateway: Express-based proxy routing /api/a → Service A and /api/b → Service B

Shared Helper: common/consulRegister.js for Consul registration and TTL-based heartbeats


🎯 Role of Consul

Service DiscoveryServices (service-a, service-b) register with Consul, providing name, address, and port.

Health ChecksEach service uses TTL-based checks, heartbeating every 5s. Unhealthy instances are deregistered after 1m.

Dynamic RoutingThe API Gateway queries Consul on each request to route traffic only to healthy instances.

Decoupling & ScalabilityServices remain unaware of fixed ports—scale horizontally by adding instances, with Consul load-balancing automatically.

**Troubleshooting tips:**
- **ECONNREFUSED to Consul:**
  - Ensure `consul` container is healthy (check `docker-compose logs consul`).
  - Verify network connectivity:
    ```bash
    docker network ls
    docker network inspect $(docker-compose ps -q service-a)  # inspect ms-net network
    ```
  - Exec into a service container and try DNS resolution:
    ```bash
    docker exec -it $(docker-compose ps -q service-a) sh
    ping consul
    ```
    If `consul` does not resolve, ensure all services are on the same Docker network (`ms-net`).
- **Service not found errors:**
  - In Consul UI, verify TTL checks are passing—if a service fails to heartbeat, it's deregistered after 1m.
  - Increase TTL or adjust deregistration settings in `common/consulRegister.js` if needed.
