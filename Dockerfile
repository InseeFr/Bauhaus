# Étape de construction
FROM node:latest as builder

WORKDIR /bauhaus

COPY ./ ./

RUN npm install --force

RUN npm run build-insee

# Étape d'exécution
FROM nginxinc/nginx-unprivileged:1.25-alpine

# Non root user
ENV NGINX_USER_ID=101
ENV NGINX_GROUP_ID=101
ENV NGINX_USER=nginx
ENV NGINX_GROUP=nginx

USER $NGINX_USER_ID

# Ajout du build au dossier root de nginx
COPY --from=builder --chown=$NGINX_USER:$NGINX_GROUP /bauhaus/build /usr/share/nginx/html

# Copie de la configuration nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=$NGINX_USER:$NGINX_GROUP /bauhaus/config/nginx.conf /etc/nginx/conf.d/nginx.conf

# Add entrypoint
COPY --from=builder --chown=$NGINX_USER:$NGINX_GROUP /bauhaus/entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
