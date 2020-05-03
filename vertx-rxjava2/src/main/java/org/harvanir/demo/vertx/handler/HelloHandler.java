package org.harvanir.demo.vertx.handler;

import io.vertx.core.Handler;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.ext.web.RoutingContext;

import java.util.List;

/**
 * @author Harvan Irsyadi
 */
public class HelloHandler implements Handler<RoutingContext> {

    private final Vertx vertx;

    public HelloHandler(Vertx vertx) {
        this.vertx = vertx;
    }

    @Override
    public void handle(RoutingContext context) {
        List<String> delays = context.queryParam("delay");

        int delay;
        if (delays != null && !delays.isEmpty() && (delay = Integer.parseInt(delays.get(0))) > 0) {
            vertx.setTimer(delay, event1 -> getResponse(context));
        } else {
            getResponse(context);
        }
    }

    private void getResponse(RoutingContext event) {
        event.response()
                .putHeader("Content-Type", "text/plain; charset=utf-8")
                .end("Hello " + event.pathParam("name"));
    }
}