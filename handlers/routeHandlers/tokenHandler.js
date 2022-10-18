/**
 * Name: token handler
 * Description: token handler for handle token related crud oparation
 * Author: Noman
 * Date: 19/10/2022
 */

// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'requested method not allowed',
        });
    }
};

handler._token = {};

// get a single token by phone number
handler._token.get = (requestProperties, callback) => {
    const tokenID =
        typeof requestProperties.queryString.token_id === 'string' &&
        requestProperties.queryString.token_id.trim().length === 20
            ? requestProperties.queryString.token_id
            : false;
    if (tokenID) {
        // get the tokenObject with the token id
        data.read('tokens', tokenID, (error, tokenObject) => {
            const token = { ...parseJSON(tokenObject) };
            if (!error && token) {
                callback(200, token);
            } else {
                callback(500);
            }
        });
    } else {
        callback(404, {
            error: 'Token ID is not valid!',
        });
    }
};

handler._token.post = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    if (phone && password) {
        // lookup a user
        data.read('users', phone, (error, u) => {
            const user = { ...parseJSON(u) };
            if (!error) {
                const hashedPassword = hash(password);
                if (phone === user.phone && hashedPassword === user.password) {
                    const tokenID = createRandomString(20);
                    const expires = Date.now() + 60 * 60 * 1000;
                    const token = {
                        id: tokenID,
                        phone,
                        expires,
                    };

                    // store token into database
                    data.create('tokens', tokenID, token, (error2) => {
                        if (!error2) {
                            callback(200, {
                                message: 'Token was created successfully',
                                token,
                            });
                        } else {
                            callback(500, {
                                error: 'Error to creating new token!',
                            });
                        }
                    });
                } else {
                    callback(403, {
                        error: 'Phone & password does not matched',
                    });
                }
            } else {
                callback(404, {
                    error: 'Requested user not found',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Please enter phone & password',
        });
    }
};

handler._token.put = (requestProperties, callback) => {
    // check the token_id is valid
    const tokenID =
        typeof requestProperties.body.token_id === 'string' &&
        requestProperties.body.token_id.trim().length === 20
            ? requestProperties.body.token_id
            : false;
    const extend =
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
            ? requestProperties.body.extend
            : false;
    if (tokenID && extend) {
        // lookup the token
        data.read('tokens', tokenID, (error, tokenObject) => {
            const token = { ...parseJSON(tokenObject) };
            if (!error && tokenID === token.id) {
                // check token already expires or not
                if (token.expires > Date.now()) {
                    token.expires = Date.now() * 60 * 60 * 1000;
                    // update token
                    data.update('tokens', tokenID, token, (error2) => {
                        if (!error2) {
                            callback(200, {
                                message: 'Token id was successfully updated!',
                            });
                        } else {
                            callback(500, {
                                error: 'Error to updating token!',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'Token id is already expires!',
                    });
                }
            } else {
                callback(401, {
                    error: 'Token id is not valid!',
                });
            }
        });
    } else {
        callback(401, {
            error: 'Token id is not valid!',
        });
    }
};

handler._token.delete = (requestProperties, callback) => {
    const tokenID =
        typeof requestProperties.queryString.token_id === 'string' &&
        requestProperties.queryString.token_id.trim().length === 20
            ? requestProperties.queryString.token_id
            : false;
    if (tokenID) {
        // lookup the token
        data.read('tokens', tokenID, (error, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!error && token) {
                // remove the token
                data.delete('tokens', tokenID, (error2) => {
                    if (!error2) {
                        callback(200, {
                            message: 'Token was deleted successfully!',
                        });
                    } else {
                        callback(500, {
                            error: 'Error to deleting the token!',
                        });
                    }
                });
            } else {
                callback(404, {
                    error: 'Token id is not valid!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'There was a problem in your request!',
        });
    }
};

module.exports = handler;
