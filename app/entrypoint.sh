#!/bin/sh
echo "window._env_['SKIP_PREFLIGHT_CHECK'] = '$SKIP_PREFLIGHT_CHECK';" >> /usr/share/nginx/html/env-config.js
echo "window._env_['API_MODE'] = '$API_MODE';" >> /usr/share/nginx/html/env-config.js
echo "window._env_['API_BASE_HOST'] = '$API_BASE_HOST';" >> /usr/share/nginx/html/env-config.js
echo "window._env_['APPLICATIONS'] = '$APPLICATIONS';" >> /usr/share/nginx/html/env-config.js
exec "$@"