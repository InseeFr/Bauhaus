#!/bin/sh

set -e


if [ -n "$BAUHAUS_API_URL" ]; then
    sed -i "s#BAUHAUS_API_URL#$BAUHAUS_API_URL#g" /usr/share/nginx/html/configuration.json
fi

exec "$@"
