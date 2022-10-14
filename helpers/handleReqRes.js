/**
 * Name: Handle request & response
 * Description: Handle request & response
 * Author: Noman
 * Date: 14/10/2022
 */

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');

// handler object - module scafollding
const handler = {};

handler.handleReqRes = (req, res) => {
    // get the url & parse the url
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const queryString = parsedUrl.query;
    const method = req.method.toLowerCase();
    const headerObject = req.headers;
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        queryString,
        method,
        headerObject,
    };

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
    const decoder = new StringDecoder('utf8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();
        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);
            // return the final response
            res.writeHead(statusCode);
            res.end(payloadString);
        });
        res.end(realData);
    });
};

module.exports = handler;
