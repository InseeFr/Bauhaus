---
title: Connect to a Colectica Repository
sidebar:
  order: 1
---

The Variables module reads and writes everything through a Colectica Repository. This guide sets up that connection.

There is no offline or mock mode: without a reachable Colectica instance, the module's endpoints fail.

## Set the server address

```yaml
fr.insee.rmes.bauhaus.colectica:
  server:
    baseUrl: https://colectica.example.com/
    apiPath: /api/v1/
    defaultAgencyId: fr.insee
```

- `baseUrl` is the server root. The token endpoint is called on it directly (`<baseUrl>/token/createtoken`).
- `apiPath` is appended to it to form the API root; leave it unless your instance is published elsewhere.
- `defaultAgencyId` is the agency Bauhaus stamps on the items it creates. It is also sent to the frontend, which uses it as a fallback when a response carries no agency.

## Choose an authentication mode

### Username and password (default)

Bauhaus obtains a token from `/token/createtoken`, caches it, and re-authenticates automatically on a `401` or `403`.

```yaml
fr.insee.rmes.bauhaus.colectica:
  server:
    authenticationMode: password
    username: ${COLECTICA_USERNAME:}
    password: ${COLECTICA_PASSWORD:}
```

Supply the values through the environment — never commit them:

```shell
export COLECTICA_USERNAME='your.account@insee.fr'
export COLECTICA_PASSWORD='…'
```

### Keycloak bearer token

Bauhaus obtains a token from **Keycloak** with the `client_credentials` grant, caches it, and refreshes it shortly before it expires. Colectica's own `/token/createtoken` endpoint is not called, and no username or password is needed.

```yaml
fr.insee.rmes.bauhaus.colectica:
  server:
    authenticationMode: token
```

The token comes from the dedicated `colecticarealm` of the Keycloak configuration, which must be filled in:

```yaml
fr.insee.rmes.bauhaus.keycloak:
  server:
    url: https://keycloak.example.com
  colecticarealm:
    name: colectica
    clientid: colectica-client
    clientsecret: ${COLECTICA_CLIENT_SECRET:}
```

Any other value of `authenticationMode` — including omitting it — falls back to username and password.

## Declare the languages

```yaml
fr.insee.rmes.bauhaus.colectica:
  langs:
    - fr-FR
    - en-GB
```

Every entry must match `xx-XX`; an invalid code stops the application at startup. The **first** language is the default locale used by the interface when it writes a label.

## Declare the item type UUIDs

Colectica identifies each DDI type by a UUID, which the module reads from configuration rather than hard-coding. The defaults shipped in `colectica.yml` match a standard Colectica installation and rarely need changing — see [DDI Item Types](/Bauhaus/guides/variables/reference/ddi-item-types/) for the full list.

## Verify the connection

With the backend running and a user holding a role on the module:

```shell
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/ddi/physical-instance
```

A `200` with a JSON array — possibly empty — means Bauhaus reached Colectica and authenticated. Check the backend logs if it does not: an authentication failure surfaces as `Authentication failed: unable to retrieve access token`.

## See also

- [Configuration Properties](/Bauhaus/guides/variables/reference/configuration-properties/) — every `fr.insee.rmes.bauhaus.colectica.*` property
- [Colectica API Reference](/Bauhaus/guides/variables/reference/colectica-api/) — the calls Bauhaus makes
