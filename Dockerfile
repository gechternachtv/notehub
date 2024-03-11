FROM alpine:latest

ARG PB_VERSION=0.19.0

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    # this is needed only if you want to use scp to copy later your pb_data locally
    openssh


ADD https://github.com/pocketbase/pocketbase/releases/download/v0.22.3/pocketbase_0.22.3_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/


# COPY ./pb_migrations /pb/pb_migrations
COPY ./pb_hooks /pb/pb_hooks
COPY ./pb_public /pb/pb_public






CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
EXPOSE 8090