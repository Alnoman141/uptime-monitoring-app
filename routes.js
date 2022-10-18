/**
 * Name: routes
 * Description: application routes
 * Author: Noman
 * Date: 14/10/2022
 */

// dependencies
const { sampelHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');

// module scafolding
const routes = {
    sample: sampelHandler,
    user: userHandler,
    token: tokenHandler,
};

module.exports = routes;
