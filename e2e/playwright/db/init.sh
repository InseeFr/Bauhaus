#!/usr/bin/env bash

curl -X DELETE http://localhost:7200/rest/repositories/bauhaus
curl -X DELETE http://localhost:7200/rest/repositories/publication

curl -X POST http://localhost:7200/rest/repositories -H 'Content-Type: multipart/form-data' -F 'config=@./playwright/db/config.ttl'
curl -X POST http://localhost:7200/rest/repositories -H 'Content-Type: multipart/form-data' -F 'config=@./playwright/db/config-diffusion.ttl'

curl -X POST "http://localhost:7200/repositories/bauhaus/statements" \
     -H "Content-Type: application/trig" \
     --data-binary "@../Bauhaus-Back-Office/src/test/resources/testcontainers/all-operations-and-indicators.trig"

curl -X POST "http://localhost:7200/repositories/bauhaus/statements" \
     -H "Content-Type: application/trig" \
     --data-binary "@../Bauhaus-Back-Office/src/test/resources/testcontainers/sims-all.trig"

curl -X POST "http://localhost:7200/repositories/bauhaus/statements" \
     -H "Content-Type: application/trig" \
     --data-binary "@../Bauhaus-Back-Office/src/test/resources/testcontainers/sims-metadata.trig"

curl -X POST "http://localhost:7200/repositories/bauhaus/statements" \
     -H "Content-Type: application/trig" \
     --data-binary "@../Bauhaus-Back-Office/src/test/resources/testcontainers/sims-codes.trig"

curl -X POST "http://localhost:7200/repositories/bauhaus/statements" \
     -H "Content-Type: application/trig" \
     --data-binary "@../Bauhaus-Back-Office/src/test/resources/testcontainers/documents.trig"

curl -X POST "http://localhost:7200/repositories/bauhaus/statements" \
     -H "Content-Type: application/trig" \
     --data-binary "@../Bauhaus-Back-Office/src/test/resources/testcontainers/organizations.trig"