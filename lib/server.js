/**
 * Name: server file
 * Description: all server related file goes here
 * Author: Noman
 * Date: 12.10.2022
 * Updated At: 21.10.2022
 */

// Dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/enviroments');
// const { sendNotification } = require('../helpers/notification');
// server object - module scafollding
const server = {};

// send notification
// sendNotification('01911111111', 'Hello world', (err) => {
//     console.log('this is the error', err);
// });

// create server
server.createServer = () => {
    const serverInstance = http.createServer(server.handleReqRes);
    serverInstance.listen(environment.port, () => {
        console.log(`server is listen on port ${environment.port}`);
    });
};

// handle requiest and response
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
    server.createServer();
};

// export the server module
module.exports = server;
