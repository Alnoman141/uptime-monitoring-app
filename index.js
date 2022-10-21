/**
 * Name: NodeJs Uptime monitoring app
 * Description: A simple nodejs uptime monitoring app for practice nodejs
 * Author: Noman
 * Date: 12/10/2022
 * Updated At: 21/10/2022
 */

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/worker');

// app object - module scafollding
const app = {};

app.init = () => {
    // run the server
    server.init();

    // run the worker
    workers.init();
};

app.init();

// export the module
module.exports = app;
