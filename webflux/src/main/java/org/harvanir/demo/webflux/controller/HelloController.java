package org.harvanir.demo.webflux.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.Duration;

/**
 * @author Harvan Irsyadi
 */
@RestController
public class HelloController {

    @GetMapping(path = "/hello/{name}", produces = MediaType.TEXT_PLAIN_VALUE)
    public Mono<String> hello(@PathVariable(name = "name") String name, @RequestParam(required = false, name = "delay") Integer delay) {
        return Mono.defer(() -> {
            String hello = "Hello " + name;

            if (delay != null) {
                return Mono.just(hello).delayElement(Duration.ofMillis(delay));
            }

            return Mono.just(hello);
        });
    }
}