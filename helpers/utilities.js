/**
 * Name: utilities
 * Description: handle all utilities functions
 * Author: Noman
 * Date: 18/10/2022
 */

// dependencies
const crypto = require('crypto');
const environments = require('./enviroments');

// module scaffolding
const utilities = {};

// json string to object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

// make a string hash
utilities.hash = (string) => {
    const hash = crypto.createHmac('sha256', environments.secretKey).update(string).digest('hex');
    return hash;
};
module.exports = utilities;
