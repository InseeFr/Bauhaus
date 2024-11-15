#!/usr/bin/env bash

curl -X DELETE http://localhost:7200/rest/repositories/bauhaus

curl -X POST http://localhost:7200/rest/repositories -H 'Content-Type: multipart/form-data' -F 'config=@./playwright/db/config.ttl'