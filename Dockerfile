### BUILD STEP ###

FROM node:24.19.0 AS builder

WORKDIR /bauhaus

COPY ./ ./

# pnpm aligné sur la version de la CI, déclarée dans l'action setup-front du
# commons. `--frozen-lockfile` : l'image résout exactement ce que la CI a
# validé, ou elle échoue — plutôt que de dériver en silence.
RUN npm i -g pnpm@12 \
    && pnpm install --frozen-lockfile \
    && pnpm build

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
ENTRYPOINT [ "sh", "-c", "/usr/share/nginx/html/vite-envs.sh && nginx -g 'daemon off;'"]
