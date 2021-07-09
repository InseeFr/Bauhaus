FROM nginx
RUN rm etc/nginx/conf.d/default.conf
COPY config/nginx.conf etc/nginx/conf.d/
COPY /app/build /usr/share/nginx/html
COPY app/entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]