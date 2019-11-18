FROM node:12 as node
WORKDIR /bauhaus
COPY ./ /bauhaus/
RUN yarn
RUN yarn build-insee

FROM nginx:1.17
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /bauhaus/app/build /usr/share/nginx/html
ADD ./config/start.sh /usr/share/nginx
RUN chmod +x /usr/share/nginx/start.sh
ENTRYPOINT [ "/usr/share/nginx/start.sh"]
CMD nginx -g 'daemon off;'
