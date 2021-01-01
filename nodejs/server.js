'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/hello/:name', async (req, res) => {
    var delay = req.query.delay;

    if (delay != null) {
        delay = parseInt(delay, 0);

        if (delay > 0) {
            await sleep(delay);
        }
    }

    res.set('Content-Type', 'text/plain; charset=utf-8')
    res.send('Hello ' + req.params['name']);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);