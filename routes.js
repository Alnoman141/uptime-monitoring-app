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
const { checkHandler } = require('./handlers/routeHandlers/checkHandler');

// module scafolding
const routes = {
    sample: sampelHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
};

module.exports = routes;
