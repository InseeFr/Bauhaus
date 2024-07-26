FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build-insee


FROM nginx
RUN rm etc/nginx/conf.d/default.conf
COPY config/nginx.conf etc/nginx/conf.d/
COPY --from=build /app/build /usr/share/nginx/html

COPY entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]
