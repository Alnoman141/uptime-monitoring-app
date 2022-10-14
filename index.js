/**
 * Name: NodeJs Uptime monitoring app
 * Description: A simple nodejs uptime monitoring app for practice nodejs
 * Author: Noman
 * Date: 12.10.2022
 */

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');

// app object - module scafollding
const app = {};

// configarations
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`server is listen on port ${app.config.port}`);
    });
};

// handle requiest and response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
