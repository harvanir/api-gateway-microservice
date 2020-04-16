# Demo API-Gateway with Downstream

## Technology
- Spring Cloud Netflix Eureka
- Spring Cloud Gateway
- Spring Webflux
- Spring Webmvc
- Golang
- Kong
- Nginx
- JMeter (test-plan-jmeter.jmx)

## Pre requiste
- Docker

## List of API Gateway / Reverse proxy
- Spring Cloud Gateway
- Kong
- Nginx

## List of Downstream
- Spring Webflux
- Spring Webmvc
- Go

## Build & Run
```shell script
sh build-run.sh
```

## List of API
### Spring Cloud Gateway
- http://localhost:9090/webflux/hello/name
- http://localhost:9090/webflux-lb/hello/name
- http://localhost:9090/webmvc/hello/name
- http://localhost:9090/go/hello/name

### Spring Webflux
- http://localhost:8080/hello/name

### Spring Webmvc
- http://localhost:8282/hello/name

### Go
- http://localhost:8181/hello/name