/**
 * Name: data.js
 * Description: this is for CRUD oparation in our file system
 * Author: Noman
 * Date: 17/10/2022
 */

// dependencies
const fs = require('fs');
const path = require('path');

// lib object - module scaffolding
const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, './../.data/');

// write data to the file
lib.create = (dir, file, data, callback) => {
    // open the file for write
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);

            // write the data to the file
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error closing the new file!');
                        }
                    });
                } else {
                    callback('Error writing a new file!');
                }
            });
        } else {
            callback('Could not create a new file.It may already exist.');
        }
    });
};

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (error, data) => {
        callback(error, data);
    });
};

// update the file
lib.update = (dir, file, data, callback) => {
    // open the exsisting file for update
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);

            // truncate the exsisting file
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    // write the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            // close the file
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callback(false);
                                } else {
                                    callback('Error to closeing the file');
                                }
                            });
                        } else {
                            callback('Error to writing the file');
                        }
                    });
                } else {
                    callback('Error to truncating the file!');
                }
            });
        } else {
            callback('Error to opening the file!');
        }
    });
};

// delete exsisting file
lib.delete = (dir, file, callback) => {
    // unlink the exisiting file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (error) => {
        if (!error) {
            callback(false);
        } else {
            callback('Error to deleting the file!');
        }
    });
};

// export the module
module.exports = lib;
