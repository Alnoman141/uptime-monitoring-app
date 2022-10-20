/**
 * Name: NodeJs Uptime monitoring app
 * Description: A simple nodejs uptime monitoring app for practice nodejs
 * Author: Noman
 * Date: 12.10.2022
 */

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/enviroments');
const { sendNotification } = require('./helpers/notification');
// app object - module scafollding
const app = {};

// send notification
sendNotification('01911111111', 'Hello world', (err) => {
    console.log('this is the error', err);
});

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`server is listen on port ${environment.port}`);
    });
};

// handle requiest and response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
