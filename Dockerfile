### BUILD STEP ###

FROM node:latest AS builder

WORKDIR /bauhaus

COPY ./ ./

RUN npm install --force && npm run build

### EXECUTION STEP ###

FROM nginxinc/nginx-unprivileged:mainline-alpine

# Non root user
ENV NGINX_USER_ID=101
ENV NGINX_GROUP_ID=101
ENV NGINX_USER=nginx
ENV NGINX_GROUP=nginx

USER $NGINX_USER_ID

# Add build to nginx root webapp
COPY --from=builder --chown=$NGINX_USER:$NGINX_GROUP /bauhaus/build /usr/share/nginx/html

# Copy nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=$NGINX_USER:$NGINX_GROUP /bauhaus/nginx.conf /etc/nginx/conf.d/nginx.conf

# Add entrypoint and start nginx server
RUN chmod 755 /usr/share/nginx/html/vite-envs.sh
RUN chown $NGINX_USER:$NGINX_GROUP /usr/share/nginx/html/index.html

ENTRYPOINT [ "sh", "-c", "/usr/share/nginx/html/vite-envs.sh &&
: "${VITE_API_BASE_HOST:?Set VITE_API_BASE_HOST env var}" &&
: "${VITE_OIDC_BASE_URL:?Set VITE_OIDC_BASE_URL env var}" &&
sed -e "s|API_BASE_HOST|${VITE_API_BASE_HOST}|g"
-e "s|OIDC_BASE_URL|${VITE_OIDC_BASE_URL}|g"
/usr/share/nginx/html/index.html > /tmp/index.html &&
cat /tmp/index.html > /usr/share/nginx/html/index.html &&
nginx -g 'daemon off;'" ]
