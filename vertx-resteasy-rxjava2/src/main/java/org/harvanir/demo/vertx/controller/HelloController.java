package org.harvanir.demo.vertx.controller;

import io.reactivex.Single;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.concurrent.TimeUnit;


/**
 * @author Harvan Irsyadi
 */
@Path("/")
public class HelloController {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("hello/{name}")
    public Single<String> hello(@PathParam("name") String name, @QueryParam("delay") Integer delay) {
        String helloName = "Hello " + name;

        if (delay != null && delay > 0) {
            return Single.just(helloName).delay(delay, TimeUnit.MILLISECONDS);
        }

        return Single.just(helloName);
    }
}