/*********************************

 File:       stacked-options.js
 Function:   Stacks the options files, returns union
 Copyright:  hrbr.io
 Date:       11/14/18 5:15 PM
 Author:     mkahn

 Enter detailed description

 **********************************/


const fs = require('fs');
const _ = require('lodash');

module.exports = function(){

    const optionsJsonString = fs.readFileSync('./options.json');

    const options = JSON.parse(optionsJsonString); // we want these to throw if there is an issue
    let localOptions = {};

    try {
        const localOptionsJsonString = fs.readFileSync('./options.local.json');
        localOptions = JSON.parse(localOptionsJsonString);
    } catch (err) {
        console.log('No options.local.json found or file is malformed.')
    }

    return _.merge(options, localOptions);

}