package org.harvanir.demo.vertx;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.VertxOptions;
import io.vertx.reactivex.core.AbstractVerticle;
import org.harvanir.demo.vertx.verticle.HttpVerticle;

/**
 * @author Harvan Irsyadi
 */
public class RxJava2Verticle extends AbstractVerticle {

    @Override
    public void start() {
        DeploymentOptions options = new DeploymentOptions();
        options.setInstances(VertxOptions.DEFAULT_EVENT_LOOP_POOL_SIZE);

        vertx.deployVerticle(HttpVerticle.class.getName(), options);
    }
}