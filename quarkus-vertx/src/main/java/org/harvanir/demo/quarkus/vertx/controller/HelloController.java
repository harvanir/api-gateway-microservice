package org.harvanir.demo.quarkus.vertx.controller;

import io.smallrye.mutiny.Uni;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
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