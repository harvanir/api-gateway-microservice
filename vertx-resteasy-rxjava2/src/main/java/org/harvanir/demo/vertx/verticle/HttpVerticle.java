package org.harvanir.demo.vertx.verticle;

import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.core.http.HttpServer;
import org.harvanir.demo.vertx.controller.HelloController;
import org.jboss.resteasy.plugins.server.vertx.VertxRequestHandler;
import org.jboss.resteasy.plugins.server.vertx.VertxResteasyDeployment;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author Harvan Irsyadi
 */
public class HttpVerticle extends AbstractVerticle {

    private final AtomicInteger retry = new AtomicInteger(0);

    @Override
    public void start() {
        try {
            HttpServer httpServer = vertx.createHttpServer();
            VertxResteasyDeployment deployment = new VertxResteasyDeployment();
            deployment.start();
            deployment.getRegistry().addPerInstanceResource(HelloController.class);
            httpServer.getDelegate().requestHandler(new VertxRequestHandler(vertx.getDelegate(), deployment));

            httpServer
                    .listen(8080, event -> System.out.println("Vertx eventloop thread started: " + Thread.currentThread().getName()));
        } catch (Exception e) {
            if (retry.incrementAndGet() < 5) {
                this.start();
            } else {
                System.err.println("Maximum retry reached...");
            }
        }
    }
}