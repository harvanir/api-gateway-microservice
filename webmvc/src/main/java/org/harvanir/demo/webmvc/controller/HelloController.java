package org.harvanir.demo.webmvc.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Harvan Irsyadi
 */
@RestController
public class HelloController {

    @GetMapping(path = "/hello/{name}", produces = MediaType.TEXT_PLAIN_VALUE)
    public String hello(@PathVariable(name = "name") String name, @RequestParam(required = false, name = "delay") Integer delay) {
        String hello = "Hello " + name;

        if (delay != null) {
            try {
                Thread.sleep(delay);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                e.printStackTrace();
            }
        }

        return hello;
    }
}