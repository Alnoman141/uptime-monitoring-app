/**
 * Name: not found handler
 * Description: 404 -not found handler
 * Author: Noman
 * Date: 14/10/2022
 */

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: '404 page not found!',
    });
};

module.exports = handler;
