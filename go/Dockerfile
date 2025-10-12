FROM golang:1.25.2-alpine3.22 AS multistage
RUN apk update && apk add --no-cache git

WORKDIR /go/src/app
COPY main.go .
COPY go.mod .
COPY go.sum .

RUN go build -o app *.go

## Optimize size image
FROM alpine:3.22.2
#RUN apk --no-cache add ca-certificates

# COPY --from=alias 'golang previous build binaries directory' 'target container directory'
RUN pwd
COPY --from=multistage /go/src/app /
CMD ["./app"]