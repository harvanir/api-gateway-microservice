package org.harvanir.demo.vertx.handler;

import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.ext.web.Router;

/**
 * @author Harvan Irsyadi
 */
public class HttpVerticle extends AbstractVerticle {

    @Override
    public void start() {
        Router router = Router.router(vertx);
        router.get("/hello/:name").handler(new HelloHandler(vertx));

        vertx.createHttpServer()
                .requestHandler(router)
                .listen(8080, event -> System.out.println("Vertx eventloop thread started: " + Thread.currentThread().getName()));
    }
}