# API Gateway x Microservice
- This project aims to explore API Gateway products combined with Microservice which uses several programming languages / frameworks.
- The expectation:
  - Advanced features & configurations.
  - Performance / Utilization comparison report (startup time, throughput, latency, cpu usage, memory usage, system behaviour under high load to handling slow process / connection / downstream, etc).
---
At the microservice layer, we use static or dynamic REST API responses that have a delay capability in milliseconds that can affect variants of performance at the API Gateway & Microservices layer.

## Topology
![Topology](docs/topology.png)

## Pre requiste
- Git
- Java JDK 8+
- Docker
- GraalVM (Quarkus native)
- JMeter

## Technology
### Service discovery
- Spring Cloud Netflix Eureka

### API Gateway / Reverse proxy
- Spring Cloud Gateway
- Nginx
- Kong

### Microservice
- Spring Webflux
- Spring Webmvc
- Golang
- Play Framework
- Vert.x RxJava2
- Quarkus Vert.x JVM
- Quarkus Vert.x Native
- Quarkus etc JVM
- Quarkus etc Native
- Akka
- NodeJS

### Testing tools
- JMeter (test-plan-jmeter.jmx)

## Build & Run
```shell script
./build
./run
./build-run
```

## API Endpoint

### API Gateway
 - URL: 
    - /webflux/hello/{name}
    - /webflux-lb/hello/{name}
    - /webmvc/hello/{name}
    - /go/hello/{name}
    - /quarkus-vertx-jvm/hello/{name}
    - /quarkus-vertx-native/hello/{name}
    - /vertx-rxjava2/hello/{name}
 - Query Parameter:
    - delay (optional)
 - API Gateway port:
    - Spring Cloud Gateway: 9090
    - Nginx: 9191

### Microservice
 - URL: 
    - /hello/{name}
 - Query Parameter:
    - delay (optional)
 - Microservice port:
    - Spring Webflux: 8080
    - Golang: 8181
    - Spring Webmvc: 8282
    - Quarkus Vert.x JVM: 8383
    - Quarkus Vert.x Native: 8484
    - Vert.x RxJava2: 8585

## Test
Open jmeter test plan file (<b>test-plan-jmeter.jmx</b>) to run the test.<br/>
Available <b>User Define Variables</b>:
- gwhost (API Gateway hostname/IP address)
- mshost (Microservice hostname/ip address)
- delay (Microservice request delay in milliseconds)
- concurrent (Number of threads(users) each thread group)
- duration (Test duration in seconds)
- rampup (Ramp-up period in seconds)