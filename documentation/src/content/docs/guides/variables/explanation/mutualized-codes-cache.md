---
title: Mutualized Code Lists Cache
---

The Bauhaus Back-Office caches the **mutualized code lists** it exposes through
`GET /ddi/mutualized-codes-list`, because computing them requires an expensive top-down
walk of a Colectica package tree (several relationship queries:
`package → CodeListScheme → CodeListGroup → CodeList`). Without a cache, every request would
pay that cost. The cache is an **in-process** Caffeine cache managed through Spring's caching
abstraction (`@Cacheable` / `@CacheEvict`).

See [Colectica Integration](../../colectica/) for the underlying API calls.

## What is cached

Two cache regions back the feature. They share the same TTL and are always evicted together,
because the high-level list is derived from the package walk and a stale walk would otherwise
survive a refresh.

| Cache name | Content | Populated by |
|------------|---------|--------------|
| `mutualizedCodesLists` | The list of code list summaries (agency, id, label) returned by `GET /ddi/mutualized-codes-list`. | `DDIRepository.getMutualizedCodesLists()` |
| `mutualizedPackageCodeListRefs` | The deduplicated set of every `CodeList` reference reachable from the configured mutualized codes package (result of the tree walk). Used by both the read path and the write path that filters non-mutualized code lists. | `MutualizedCodeListRefsProvider.codeListRefs()` |

The cache region names are defined once in `ColecticaCacheNames` and shared between the
`@Cacheable` annotations (`module-ddi`) and the `CacheManager` declaration (`module-bauhaus-bo`).

## TTL (time to live)

Both regions use Caffeine's `expireAfterWrite`: an entry expires a fixed duration after it was
written, regardless of reads. The duration is configured with:

```yaml
fr.insee.rmes.bauhaus.colectica.mutualized-codes-cache-ttl: 24h
```

- Format: Spring `Duration` (e.g. `24h`, `30m`, `90s`).
- Default: **24h** when the property is absent.

After the TTL elapses, the next request transparently recomputes the value from Colectica and
re-caches it.

## Cache warm-up at startup

To avoid the first user paying for the (potentially slow) Colectica walk, the cache is
**pre-loaded at application startup**. On `ApplicationReadyEvent`, `MutualizedCodesCacheWarmer`
calls `getMutualizedCodesLists()` through its Spring proxy, which populates both cache regions.

- The load runs on a background task executor, so a slow or unreachable Colectica **never blocks
  startup**.
- Failures are swallowed: if the warm-up fails, the cache is simply loaded lazily on the first
  request instead.

It can be disabled with:

```yaml
fr.insee.rmes.bauhaus.colectica.cache-warmup-enabled: false  # default: true
```

## How to evict (force a refresh)

A client can force an immediate refresh by sending a standard HTTP `Cache-Control` header on the
`GET` endpoint. When the header contains `no-cache` or `no-store`, both cache regions are evicted
**before** the list is recomputed from Colectica and re-cached.

```http
GET {{API_BASE_URL}}/ddi/mutualized-codes-list
Cache-Control: no-cache
```

Eviction clears all entries of both `mutualizedCodesLists` and `mutualizedPackageCodeListRefs`
(`@CacheEvict(allEntries = true)`). Evicting only the high-level list would still serve a stale
package tree on recompute, which is why both regions are flushed.

## Configuration reference

| Property | Default | Description |
|----------|---------|-------------|
| `fr.insee.rmes.bauhaus.colectica.mutualized-codes-package` | — | The Colectica package (agency-id / identifier / version) whose tree is walked to determine the mutualized code lists. Absent = no mutualized code lists. |
| `fr.insee.rmes.bauhaus.colectica.mutualized-codes-cache-ttl` | `24h` | In-process cache TTL (`expireAfterWrite`), Spring `Duration` format. |
| `fr.insee.rmes.bauhaus.colectica.cache-warmup-enabled` | `true` | Pre-load the cache at startup (non-blocking, fault-tolerant). |
