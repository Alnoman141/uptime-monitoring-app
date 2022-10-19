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
handler._checks.get = (requestProperties, callback) => {};

handler._checks.post = (requestProperties, callback) => {};

handler._checks.put = (requestProperties, callback) => {
    // check the phone number if valid
};

handler._checks.delete = (requestProperties, callback) => {};

module.exports = handler;
