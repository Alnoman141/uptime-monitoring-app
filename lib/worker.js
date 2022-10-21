/**
 * Name: worker file
 * Description: all worker related file goes here
 * Author: Noman
 * Date: 21.10.2022
 */

// Dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../helpers/utilities');
const { sendNotification } = require('../helpers/notification');
// worker object - module scafollding
const worker = {};

// lookup all the checks
worker.gatherAllChecks = () => {
    // gather all the checks
    data.list('checks', (error, checks) => {
        if (!error && checks && checks.length > 0) {
            checks.forEach((check) => {
                // get the checkData
                data.read('checks', check, (error2, checkData) => {
                    if (!error2 && checkData) {
                        // pass the data to check validator
                        worker.validateCheckData(parseJSON(checkData));
                    } else {
                        console.log('Error: reading one of the check data!');
                    }
                });
            });
        } else {
            console.log('Error: to read the checks list!');
        }
    });
};

// check validator
worker.validateCheckData = (originalCheckData) => {
    const checkObject = originalCheckData;

    checkObject.state =
        typeof originalCheckData.state === 'string' &&
        ['up', 'down'].indexOf(originalCheckData.state) > -1
            ? originalCheckData.state
            : 'down';
    checkObject.lastCheck =
        typeof originalCheckData.lastCheck === 'number' && originalCheckData.lastCheck > 0
            ? originalCheckData.lastCheck
            : false;
    // pass to the next process
    worker.performCheck(checkObject);
};
// perform the check
worker.performCheck = (checkObject) => {
    // prepare the initial check outcome
    let checkOutCome = {
        error: false,
        responseCode: false,
    };

    // mark the outcome has not been sent yet
    let outComeSent = false;

    const parsedUrl = url.parse(`${checkObject.protocol}://${checkObject.url}`, true);
    const hostName = parsedUrl.hostname;
    const { path } = parsedUrl;

    // construct the request
    const requestDetails = {
        protocol: `${checkObject.protocol}:`,
        hostname: hostName,
        method: checkObject.method.toUpperCase(),
        path,
        timeout: checkObject.timeout * 1000,
    };

    const protocolToUse = checkObject.protocol === 'https' ? https : http;

    const req = protocolToUse.request(requestDetails, (res) => {
        // grab the status of the response
        const status = res.statusCode;

        // update the check process
        checkOutCome.responseCode = status;
        if (!outComeSent) {
            worker.updateCheckProcess(checkObject, checkOutCome);
            outComeSent = true;
        }
    });

    req.on('error', (e) => {
        checkOutCome = {
            error: true,
            value: e,
        };
        // update the check process
        if (!outComeSent) {
            worker.updateCheckProcess(checkObject, checkOutCome);
            outComeSent = true;
        }
    });

    req.on('timeout', () => {
        checkOutCome = {
            error: true,
            value: 'timeout',
        };
        // update the check process
        if (!outComeSent) {
            worker.updateCheckProcess(checkObject, checkOutCome);
            outComeSent = true;
        }
    });

    req.end();
};
// update check process
worker.updateCheckProcess = (checkObject, checkOutCome) => {
    // check if checkoutcome is up or down
    const state =
        !checkOutCome.error &&
        checkOutCome.responseCode &&
        checkObject.successCodes.indexOf(checkOutCome.responseCode) > -1
            ? 'up'
            : 'down';
    // check whether we should alert the user or not
    const alertWanted = !!(checkObject.lastCheck && checkObject.state !== state);
    // update the check data
    const newCheckObject = checkObject;
    newCheckObject.lastCheck = Date.now();
    newCheckObject.state = state;

    // update the check to the desk
    data.update('checks', newCheckObject.id, newCheckObject, (error) => {
        if (!error) {
            if (alertWanted) {
                // send the checkdata to the next process
                worker.alertUserToStatusChange(newCheckObject);
            } else {
                console.log('Alert is not need as there is no state change!');
            }
        } else {
            console.log('Error: update the check object!');
        }
    });
};
// send notifcation message to the user if state is changes
worker.alertUserToStatusChange = (newCheckObject) => {
    const msg = `Alert: Your check for ${newCheckObject.method.toUpperCase()} ${
        newCheckObject.protocol
    }://${newCheckObject.url} is currently ${newCheckObject.state}`;

    // send the notification via sms
    sendNotification(newCheckObject.userPhone, msg, (error) => {
        if (!error) {
            console.log(`User was alreted to a status change via SMS ${msg}`);
        } else {
            console.log('Error: Alret message cannot sent! ');
        }
    });
};
// timer to excute the worker process once per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 8000);
};
// start the worker
worker.init = () => {
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop so that checks continue
    worker.loop();
};

// export the worker module
module.exports = worker;
