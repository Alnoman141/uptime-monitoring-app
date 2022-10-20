/**
 * Name: notification
 * Description: function for send notification
 * Author: Noman
 * Date: 20/10/2022
 */

// dependencies
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./enviroments');
// module - scaffolding
const notification = {};

// notification send
notification.sendNotification = (phone, msg, callback) => {
    const userPhone =
        typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const message =
        typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 160
            ? msg.trim()
            : false;
    if (userPhone && message) {
        const payload = {
            Form: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: message,
        };
        // make stringify the payload
        const stringifyPayload = querystring.stringify(payload);

        // configure the request details
        const requestDetails = {
            hostname: 'twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the sent request
            const status = res.statusCode;
            // callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });
        req.write(stringifyPayload);
        req.end();
    } else {
        callback(400, {
            error: 'There was an error in your request!',
        });
    }
};

// exports the module
module.exports = notification;
