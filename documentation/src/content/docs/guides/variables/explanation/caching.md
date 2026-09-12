---
title: Caching Colectica Reads
sidebar:
  order: 5
---

Two of the module's read paths are expensive enough that recomputing them per request would be visible to users: the list of mutualized code lists, and the advanced search over physical instances. Both walk the Colectica graph — several relationship queries, then a batch fetch — before they can answer.

The backend therefore memoises them in an **in-process Caffeine cache**, driven through Spring's caching abstraction (`@Cacheable` / `@CacheEvict`). There is no distributed cache: each instance of the backend keeps its own.

## The three cache regions

| Region | Content | Populated by |
|--------|---------|--------------|
| `mutualizedCodesLists` | The code list summaries (agency, id, label, name, version date) returned by `GET /ddi/mutualized-codes-list` | `DDIRepository.getMutualizedCodesLists()` |
| `mutualizedPackageCodeListRefs` | The deduplicated set of every `CodeList` reference considered mutualized | `MutualizedCodeListRefsProvider` / `ConfiguredGroupsCodeListRefsProvider` |
| `physicalInstanceSearchRows` | The rows of `GET /ddi/physical-instance/search`, joining each physical instance to its study unit and group | `DDIRepository.getPhysicalInstanceSearchRows()` |

The region names are declared once in `ColecticaCacheNames`, shared between the `@Cacheable` annotations in `module-ddi` and the `CacheManager` in `module-bauhaus-bo`, so both always refer to the same regions.

`mutualizedPackageCodeListRefs` deserves its own region because it has two callers: the read path that lists mutualized lists, and the **write** path, which uses it to tell apart the code lists it must file under the group's scheme from the mutualized ones it must leave alone. It lives in its own bean for the same reason — a self-invocation inside `DDIRepositoryImpl` would bypass the proxy and never hit the cache.

## Expiry

All three regions use Caffeine's `expireAfterWrite`: an entry expires a fixed duration after it was written, no matter how often it is read.

```yaml
fr.insee.rmes.bauhaus.colectica.mutualized-codes-cache-ttl: 24h
```

Spring `Duration` format (`24h`, `30m`, `90s`), defaulting to **24h**. Once the TTL elapses, the next request transparently recomputes the value and re-caches it.

## Warm-up at startup

To stop the first user from paying for the walk, both lists are pre-loaded on `ApplicationReadyEvent` by `MutualizedCodesCacheWarmer`.

The warm-up is deliberately unobtrusive:

- it runs on the application task executor, so a slow or unreachable Colectica **never blocks startup**
- failures are logged and swallowed; the cache is then simply loaded lazily on the first request

Disable it with:

```yaml
fr.insee.rmes.bauhaus.colectica.cache-warmup-enabled: false   # default: true
```

## Invalidation

**Writes evict the search rows.** Creating a physical instance, patching it, or replacing it evicts `physicalInstanceSearchRows` entirely, so the advanced search never shows a data file that no longer matches.

**Clients can force a refresh** on either read path, with the standard HTTP header on the `GET`:

```http
GET {{API_BASE_URL}}/ddi/mutualized-codes-list
Cache-Control: no-cache
```

```http
GET {{API_BASE_URL}}/ddi/physical-instance/search
Cache-Control: no-cache
```

In both cases the value `no-cache` **or** `no-store` — matched case-insensitively, anywhere in the header — evicts the region before the response is recomputed, never after: serving the stale entry one last time is exactly what the caller asked to avoid.

The two endpoints differ in what they flush:

| Endpoint | Regions evicted |
|----------|-----------------|
| `GET /ddi/mutualized-codes-list` | `mutualizedCodesLists` **and** `mutualizedPackageCodeListRefs` |
| `GET /ddi/physical-instance/search` | `physicalInstanceSearchRows` |

The mutualized listing flushes both of its regions together: evicting only the high-level list would recompute it from a stale package tree.

Why the search rows need the header at all, given that writes already evict them: the eviction only covers writes **made through Bauhaus**. A physical instance created, moved or renamed directly in Colectica leaves the cached rows untouched, and the advanced search keeps serving them until the TTL elapses. The header is the way to pick such a change up immediately, without restarting the backend.

Nothing else invalidates the mutualized regions: they describe a vocabulary maintained outside the module, so a change there becomes visible after the TTL, or after an explicit refresh.

## See also

- [Configure Mutualized Code Lists](/Bauhaus/guides/variables/how-to/configure-mutualized-code-lists/) — choosing a strategy, TTL and warm-up
- [Configuration Properties](/Bauhaus/guides/variables/reference/configuration-properties/)
