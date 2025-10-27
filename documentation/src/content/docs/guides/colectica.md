---
title: Colectica Integration
---

## Overview

The DDI module in Bauhaus interacts with **Colectica Repository**, a platform for managing DDI (Data Documentation Initiative) metadata. Colectica Repository provides comprehensive metadata management capabilities for survey and statistical data.

## Colectica Repository

Colectica Repository is an external system that stores and manages DDI metadata. The Bauhaus DDI module communicates with Colectica Repository via its REST API to:

- Create and manage physical instances
- Store DDI-compliant metadata
- Query and retrieve metadata objects
- Maintain versioning and provenance information

For more information about Colectica Repository, visit [Colectica's official documentation](https://www.colectica.com/).

## Development Mode: Mock Server

To facilitate development and testing without requiring a full Colectica Repository installation, Bauhaus provides a mock server that simulates the Colectica API.

### Enabling Mock Server

The mock server can be enabled via the Bauhaus Back-Office configuration properties:

```properties
# Enable Colectica mock server
fr.insee.rmes.bauhaus.colectica.mock-server-enabled=true

# Mock server base URI
fr.insee.rmes.bauhaus.colectica.baseURI=http://localhost:8080/api/colectica
```

### Configuration Properties

| Property | Description | Example Value |
|----------|-------------|---------------|
| `fr.insee.rmes.bauhaus.colectica.mock-server-enabled` | Enable/disable the mock server | `true` or `false` |
| `fr.insee.rmes.bauhaus.colectica.baseURI` | Base URI for Colectica API endpoints | `http://localhost:8080/api/colectica` |

### Development Workflow

When the mock server is enabled:

1. **No External Dependencies**: You don't need to install or configure a Colectica Repository instance
2. **API Simulation**: The Bauhaus Back-Office will respond to Colectica API calls with simulated data
3. **Rapid Development**: Developers can work on the DDI module features without external system dependencies
4. **Testing**: Automated tests can run against the mock server for consistent, reproducible results

### Production Configuration

For production environments, disable the mock server and configure the actual Colectica Repository endpoint:

```properties
# Disable mock server for production
fr.insee.rmes.bauhaus.colectica.mock-server-enabled=false

# Production Colectica Repository URI
fr.insee.rmes.bauhaus.colectica.baseURI=https://colectica.production.example.com/api
```

## Additional Resources

- [DDI Alliance](https://ddialliance.org/) - Official DDI standards documentation
- [Colectica Documentation](https://www.colectica.com/documentation) - Colectica-specific guides