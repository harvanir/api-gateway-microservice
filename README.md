# Demo API-Gateway with Microservices

## Topology
![Topology](docs/topology.png)

## Technology
- Spring Cloud Netflix Eureka
- Spring Cloud Gateway
- Spring Webflux
- Spring Webmvc
- Golang
- Kong
- Nginx
- [ ] NodeJS
- JMeter (test-plan-jmeter.jmx)

## Pre requiste
- Docker

## List of API Gateway / Reverse proxy
- Spring Cloud Gateway
- Kong
- Nginx

## List of Microservices
- Spring Webflux
- Spring Webmvc
- Go

## Build & Run
```shell script
./build-run
```

## List of API
### Spring Cloud Gateway
- http://localhost:9090/webflux/hello/name
- http://localhost:9090/webflux-lb/hello/name
- http://localhost:9090/webmvc/hello/name
- http://localhost:9090/go/hello/name

### Nginx
- http://localhost:9191/webflux/hello/name
- http://localhost:9191/webmvc/hello/name
- http://localhost:9191/go/hello/name

### Spring Webflux
- http://localhost:8080/hello/name

### Spring Webmvc
- http://localhost:8282/hello/name

### Go
- http://localhost:8181/hello/name

## Test
Open jmeter test plan file (<b>test-plan-jmeter.jmx</b>) to run the test.<br/>
See <b>User Define Variables</b>.