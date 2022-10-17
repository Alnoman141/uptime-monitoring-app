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
const data = require('./lib/data');

// app object - module scafollding
const app = {};

// create file
// data.create('test', 'newFile', { name: 'Bangladesh', language: 'Bangla' }, (error) => {
//     console.log(error);
// });

// read file
// data.read('test', 'newFile', (error, result) => {
//     console.log(error, result);
// });

// update the file
data.update('test', 'newFile', { name: 'noman', age: 27 }, (error) => {
    console.log(error);
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
