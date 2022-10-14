/**
 * Name: routes
 * Description: application routes
 * Author: Noman
 * Date: 14/10/2022
 */

// dependencies
const { sampelHandler } = require('./handlers/routeHandlers/sampleHandler');

// module scafolding
const routes = {
    sample: sampelHandler,
};

module.exports = routes;
