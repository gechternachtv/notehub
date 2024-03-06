FROM alpine:latest
COPY pocketbase /usr/local/bin/pocketbase
COPY pb_public /usr/local/bin/pb_public
COPY pb_hooks /usr/local/bin/pb_hooks
CMD ["/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:8090"]
EXPOSE 8090