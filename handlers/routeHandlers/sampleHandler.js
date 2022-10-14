/**
 * Name: sampel handler
 * Description: sampel handler
 * Author: Noman
 * Date: 14/10/2022
 */

// module scaffolding
const handler = {};

handler.sampelHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'you are in sample page',
    });
};

module.exports = handler;
