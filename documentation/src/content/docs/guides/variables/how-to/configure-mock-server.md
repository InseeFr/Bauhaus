---
title: Configure the Colectica Mock Server
---

The Bauhaus Back-Office ships a mock server that simulates the Colectica Repository API. Use it for local development and automated tests when a real Colectica instance is not available.

## Enable the mock server

In your Spring Boot configuration file:

```properties
fr.insee.rmes.bauhaus.colectica.mock-server-enabled=true
fr.insee.rmes.bauhaus.colectica.baseURI=http://localhost:8080/api/colectica
```

When enabled:
- No external Colectica installation is required
- The backend responds to all Colectica API calls with simulated data
- Automated tests run against a consistent, reproducible dataset

## Disable for production

```properties
fr.insee.rmes.bauhaus.colectica.mock-server-enabled=false
fr.insee.rmes.bauhaus.colectica.baseURI=https://colectica.your-domain.example.com/api
```

Replace the URI with the address of your production Colectica Repository instance.

## Configuration reference

| Property | Description | Example |
|----------|-------------|---------|
| `fr.insee.rmes.bauhaus.colectica.mock-server-enabled` | Enable or disable the mock server | `true` / `false` |
| `fr.insee.rmes.bauhaus.colectica.baseURI` | Base URI for Colectica API endpoints | `http://localhost:8080/api/colectica` |
