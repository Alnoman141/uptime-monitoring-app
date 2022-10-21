/**
 * Name: worker file
 * Description: all worker related file goes here
 * Author: Noman
 * Date: 21.10.2022
 */

// Dependencies
// worker object - module scafollding
const worker = {};
// start the worker
worker.init = () => {
    console.log('worker started');
};

// export the worker module
module.exports = worker;
