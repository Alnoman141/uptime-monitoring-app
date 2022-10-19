/**
 * Name: check handler
 * Description: check handler for handle check related crud oparation
 * Author: Noman
 * Date: 18/10/2022
 */

// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._checks[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'requested method not allowed',
        });
    }
};

handler._checks = {};

// get a single check by phone number
handler._checks.get = (requestProperties, callback) => {
    // request validation
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['get', 'post', 'put', 'delete'].indexOf(typeof requestProperties.body.method) > -1
            ? typeof requestProperties.body.method
            : false;

    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    const timeout =
        typeof requestProperties.body.timeout === 'number' &&
        requestProperties.body.timeout % 1 === 0 &&
        requestProperties.body.timeout >= 1 &&
        requestProperties.body.timeout <= 5
            ? requestProperties.body.timeout
            : false;
};

handler._checks.post = (requestProperties, callback) => {};

handler._checks.put = (requestProperties, callback) => {
    // check the phone number if valid
};

handler._checks.delete = (requestProperties, callback) => {};

module.exports = handler;
