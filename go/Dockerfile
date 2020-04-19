FROM golang:1.14.2-alpine3.11
RUN apk update && apk add --no-cache git

WORKDIR /go/src/app
COPY . .

RUN go get -d -v
RUN go install -v

CMD ["app"]