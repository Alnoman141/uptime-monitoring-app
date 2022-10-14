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
};

// production environment
environments.production = {
    port: 5000,
    name: 'production',
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
