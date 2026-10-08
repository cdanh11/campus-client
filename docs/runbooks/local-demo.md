# Run Campus Platform locally

Keep campus-service and campus-client as sibling folders. Requires Java 21, Node >=24.13 within major 24, npm and Docker. Configure the backend ignored .env, including a real Base64 JWT key and local PostgreSQL values; keep secrets out of this repository. A new database needs first-account setup through the sibling backend `scripts/start-local.ps1 -BootstrapAdmin`; credentials are entered privately. Existing accounts continue using normal login.

## Start in two terminals

In campus-service:

```powershell
.\scripts\start-local.ps1
```

This loads the backend local environment and starts Compose PostgreSQL with its existing volume, then runs Spring Boot with Flyway and Hibernate validation. Normal startup does not create an administrator or reset the database. Explicit first-account setup uses the separate -BootstrapAdmin switch.

In campus-client:

```powershell
npm ci # first setup or dependency changes
npm run dev
```

Open http://localhost:3000, sign in with the existing local account and use the role-appropriate screens. The frontend proxies /api to localhost:8080. Verify backend /actuator/health separately; successful HTML/health responses alone do not establish business acceptance.

Stop application terminals with Ctrl+C. If needed, stop only Compose postgres from the backend folder; never delete its volume. Do not run browser suites while this Vite server occupies port 3000. The real-backend test runner needs a separate clean backend checkout and isolated Testcontainers database.

Full backend startup/troubleshooting instructions are in the sibling campus-service checkout at `docs/runbooks/local-demo.md`. Test/demo completion gates are in the [Phase 8–9 plan](../plans/phase-8-9-local-demo.md); no production deployment or AI implementation is required.
