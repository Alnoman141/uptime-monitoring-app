/**
 * Name: user handler
 * Description: user handler for handle user related crud oparation
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

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'requested method not allowed',
        });
    }
};

handler._users = {};

// get a single user by phone number
handler._users.get = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryString.phone === 'string' &&
        requestProperties.queryString.phone.trim().length === 11
            ? requestProperties.queryString.phone
            : false;
    if (phone) {
        // verify token
        const token =
            typeof requestProperties.headerObject.token === 'string' &&
            requestProperties.headerObject.token.trim().length === 20
                ? requestProperties.headerObject.token
                : false;
        if (token) {
            tokenHandler._token.verify(token, phone, (tokenId) => {
                if (!tokenId) {
                    callback(403, {
                        error: 'Unauthenticated!',
                    });
                } else {
                    // get the user
                    data.read('users', phone, (err, u) => {
                        const user = { ...parseJSON(u) };
                        delete user.password;
                        if (!err && user) {
                            callback(200, user);
                        } else {
                            callback(404, {
                                error: 'Requested user not found!',
                            });
                        }
                    });
                }
            });
        } else {
            callback(403, {
                error: 'Unauthenticated. Token not given!',
            });
        }
    } else {
        callback(404, {
            error: 'Requested user not found!',
        });
    }
};

handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

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

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure user was not alreday registered
        data.read('users', phone, (error) => {
            if (error) {
                const user = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // craete user
                data.create('users', phone, user, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'user was created successfully!',
                        });
                    } else {
                        callback(500, {
                            error: 'user could not created',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'User is already registered!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Please fill out al the fields!',
        });
    }
};

handler._users.put = (requestProperties, callback) => {
    // check the phone number if valid
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    if (phone) {
        if (firstName || lastName || password) {
            // verify token
            const token =
                typeof requestProperties.headerObject.token === 'string' &&
                requestProperties.headerObject.token.trim().length === 20
                    ? requestProperties.headerObject.token
                    : false;
            if (token) {
                tokenHandler._token.verify(token, phone, (tokenId) => {
                    if (!tokenId) {
                        callback(403, {
                            error: 'Unauthenticated!',
                        });
                    } else {
                        // loopkup the user
                        data.read('users', phone, (err1, uData) => {
                            const userData = { ...parseJSON(uData) };

                            if (!err1 && userData) {
                                if (firstName) {
                                    userData.firstName = firstName;
                                }
                                if (lastName) {
                                    userData.firstName = firstName;
                                }
                                if (password) {
                                    userData.password = hash(password);
                                }

                                // store to database
                                data.update('users', phone, userData, (err2) => {
                                    if (!err2) {
                                        callback(200, {
                                            message: 'User was updated successfully!',
                                        });
                                    } else {
                                        callback(500, {
                                            error: 'There was a problem in the server side!',
                                        });
                                    }
                                });
                            } else {
                                callback(400, {
                                    error: 'You have a problem in your request!',
                                });
                            }
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Unauthenticated. Token not valid!',
                });
            }
        } else {
            callback(400, {
                error: 'You have a problem in your request!',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number. Please try again!',
        });
    }
};

handler._users.delete = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryString.phone === 'string' &&
        requestProperties.queryString.phone.trim().length === 11
            ? requestProperties.queryString.phone
            : false;
    if (phone) {
        // verify token
        const token =
            typeof requestProperties.headerObject.token === 'string' &&
            requestProperties.headerObject.token.trim().length === 20
                ? requestProperties.headerObject.token
                : false;
        if (token) {
            tokenHandler._token.verify(token, phone, (tokenId) => {
                if (!tokenId) {
                    callback(403, {
                        error: 'Unauthenticated!',
                    });
                } else {
                    // lookup the user
                    data.read('users', phone, (error, user) => {
                        if (!error && user) {
                            // remove the user
                            data.delete('users', phone, (err) => {
                                if (!err) {
                                    callback(200, {
                                        message: 'User was deleted successfully',
                                    });
                                } else {
                                    callback(500, {
                                        message: 'Error to deleting the user',
                                    });
                                }
                            });
                        } else {
                            callback(404, {
                                error: 'Requested user not found!',
                            });
                        }
                    });
                }
            });
        } else {
            callback(403, {
                error: 'Unauthenticated. Token not given!',
            });
        }
    } else {
        callback(404, {
            error: 'Requested user not found!',
        });
    }
};

module.exports = handler;
