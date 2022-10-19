/**
 * Name: check handler
 * Description: check handler for handle check related crud oparation
 * Author: Noman
 * Date: 18/10/2022
 */

// dependencies
const data = require('../../lib/data');
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { maxCheckLimit } = require('../../helpers/enviroments');

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

handler._checks.post = (requestProperties, callback) => {
    // request validation
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
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
    // check user input is valid or not
    if (protocol && method && url && successCodes && timeout) {
        // check authentication
        const token =
            typeof requestProperties.headerObject.token === 'string' &&
            requestProperties.headerObject.token.trim().length === 20
                ? requestProperties.headerObject.token
                : false;
        // get user by the tokenData by the token and the phone number according to the token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const tokenObject = { ...parseJSON(tokenData) };
                const userPhone = tokenObject.phone;
                // get user by the phone number
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        // verify the token
                        tokenHandler._token.verify(token, userPhone, (isTokenValid) => {
                            if (isTokenValid) {
                                const userObject = parseJSON(userData);
                                const userChecks =
                                    typeof userObject.checks === 'object' &&
                                    userObject.checks instanceof Array
                                        ? userObject.checks
                                        : [];
                                if (userChecks.length < maxCheckLimit) {
                                    const checkId = createRandomString(20);
                                    const checkObject = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        method,
                                        url,
                                        successCodes,
                                        timeout,
                                    };
                                    // save check to the checks folder
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200, {
                                                        message: 'Check was created successfully!',
                                                        check: checkObject,
                                                    });
                                                } else {
                                                    callback(500, {
                                                        error: 'Error to updating user!',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'Error to creating check!',
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: 'User has already reached max checks limit!',
                                    });
                                }
                                // check user's max checks limit
                            } else {
                                callback(401, {
                                    error: 'Unauthenticated!',
                                });
                            }
                        });
                    } else {
                        callback(401, {
                            error: 'Authentication error!',
                        });
                    }
                });
            } else {
                callback(401, {
                    error: 'Authentication error!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
};

handler._checks.put = (requestProperties, callback) => {
    // check the phone number if valid
};

handler._checks.delete = (requestProperties, callback) => {};

module.exports = handler;
