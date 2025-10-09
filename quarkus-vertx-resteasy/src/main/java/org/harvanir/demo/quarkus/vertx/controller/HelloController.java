package org.harvanir.demo.quarkus.vertx.controller;

import io.smallrye.mutiny.Uni;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.time.Duration;

/**
 * @author Harvan Irsyadi
 */
@Path("/")
public class HelloController {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("hello/{name}")
    public Uni<String> hello(@PathParam("name") String name, @QueryParam("delay") Integer delay) {
        Uni<String> item = Uni.createFrom().item(() -> "Hello " + name);
        if (delay != null && delay > 0) {
            item = item.onItem().delayIt().by(Duration.ofMillis(delay));
        }
        return item;
    }
}