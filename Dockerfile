FROM proxy-docker-io.insee.fr/nginx:stable-alpine

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

#Add build to nginx root webapp
ADD dist /usr/share/nginx/html

#Copy nginx configuration
RUN rm etc/nginx/conf.d/default.conf
COPY container/nginx.conf etc/nginx/conf.d/

WORKDIR /usr/share/nginx/html

ADD container/env.sh /usr/share/nginx/html
ADD .env /usr/share/nginx/html

# Make our shell script executable
RUN chmod +x /usr/share/nginx/html/env.sh

# add non-root user
# RUN touch /var/run/nginx.pid
# RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# # non root users cannot listen on 80
# EXPOSE 8080

# USER nginx

# ENTRYPOINT [ "/usr/share/nginx/html/env.sh" ]
CMD ["nginx", "-g", "daemon off;"]
