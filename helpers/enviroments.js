/**
 * Name: Handle request & response
 * Description: Handle request & response
 * Author: Noman
 * Date: 15/10/2022
 */

// dependencies

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3000,
    name: 'staging',
    secretKey: '1416',
    maxCheckLimit: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
        authToken: '9455e3eb3109edc12e3d8c92768f7a67',
    },
};

// production environment
environments.production = {
    port: 5000,
    name: 'production',
    ecretKey: '14161416',
    maxCheckLimit: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
        authToken: '9455e3eb3109edc12e3d8c92768f7a67',
    },
};

// determine which environment is passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export correspondign environment object

const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export environment
module.exports = environmentToExport;
