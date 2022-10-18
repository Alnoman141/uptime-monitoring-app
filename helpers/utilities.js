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

// make a random string
utilities.createRandomString = (stringLength) => {
    let length = stringLength;
    length = typeof length === 'number' ? length : false;
    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyzABDCEDFHIJKLMNOPQRSTUVWXYZ1234567890';
        let output = '';
        for (let i = 0; i < length; i += 1) {
            const randomChar = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
            output += randomChar;
        }
        return output;
    }
    return false;
};
module.exports = utilities;
