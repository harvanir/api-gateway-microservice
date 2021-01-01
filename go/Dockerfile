FROM golang:1.15.6-alpine3.12 as multistage
RUN apk update && apk add --no-cache git

WORKDIR /go/src/app
COPY . .

RUN go get -d -v
RUN go install -v

## Optimize size image
FROM alpine:3.12.3

# COPY --from=alias 'golang previous build binaries directory' 'target container directory'
COPY --from=multistage /go/bin/app /app
CMD ["/app"]