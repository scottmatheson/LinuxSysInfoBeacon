/*********************************

 File:       index.js
 Function:   Main entry for Sysinfo Beacon
 Copyright:  hrbr.io
 Date:       6/27/18 6:40 PM
 Author:     mkahn

 **********************************/

const args = require('minimist')(process.argv.slice(2));
const pjson = require('../package.json');
const options = require('../options.json');
const loopDelay = options.sampleInterval * 1000 | args.i || 60000;

const colors = require('colors');
const verbose = args.hasOwnProperty('v');

const Promise = require('bluebird');
const Beacon = require('beacon-es6-driver');

const si = require('systeminformation');
const _ = require('lodash');
const fs = require('fs');

const legitFunctions = _.filter(si, _.isFunction).map(f => f.name);

function log(msg) {
    if (!verbose) return;
    console.log(msg)
}

function printHeader() {
    log("\n==================================".green);
    log("Hrbr.io SystemInformation Linux Beacon in Node".green);
    log("==================================".green);
    log(("Sample interval: " + loopDelay / 1000 + " seconds").underline.red);
}

// All work to build and send the beacon goes in here
function sample() {

    log(new Date() + ': Hrbr.io SysInfo Beacon is Sampling');

    const functions = options.functions && options.functions.length ? options.functions : ["cpu", "mem", "fsSize", "currentLoad"];


    const functionObj = functions.reduce((obj, func) => {
        if (legitFunctions.indexOf(func)>-1){
            obj[func] = si[func]();
        } else {
            obj[func] = Promise.resolve(`${func} is not available in SystemInfo`);
        }
        return obj;
    }, {});

    Promise.props(functionObj)
        .then(res => {
            log(res);
            //fs.writeFileSync('example.json', JSON.stringify(res, null, 2));
            Beacon.transmit({beaconMessageType: 'SYSINFO', data: res});
        })
        .catch(err => {
            log(err);
        });

}

printHeader();

function initialize(beaconInstanceId) {

    Beacon.initialize({
        apiKey: options.apikey,
        appVersionId: options.appVersionId || `${pjson.name}:${pjson.version}`,
        beaconVersionId: `${pjson.name}:${pjson.version}`,
        beaconInstanceId: beaconInstanceId,
        txOptions: {
            server: options.server || 'production'
        },
        bufferOptions: {
            lengthLimit: 100000
        },
        interMessageDelayMs: 1000,
        //drainedCb: drained
    });

    setInterval(sample, loopDelay);
    // setInterval(()=>{
    //     Beacon.transmit({beaconMessageType: 'HBEAT', data: { message: 'Alive!', random: Math.random()*10 }});
    // }, 2500);

}

if (options.beaconInstanceId.includes('auto:mac')) {

    const components = options.beaconInstanceId.split(':');
    if (components.length !== 3) {
        console.error('Incorrect network interface in options.beaconInstanceId');
        process.exit(1);
    }

    si.networkInterfaces()
        .then(ni => {

            const iface = _.find(ni, {iface: components[2]});
            if (!iface) {
                console.error('No such interface for setting beaconInstanceId via options.beaconInstanceId');
                process.exit(1)
            }

            if (!iface.mac) {
                console.error('No such mac address on interface for setting beaconInstanceId via options.beaconInstanceId');
                process.exit(1)
            }


            console.log(`beaconInstanceID initialized from MAC address => MAC::${iface.mac}`);
            initialize(`MAC::${iface.mac}`);

        });

} else {

    initialize(options.beaconInstanceId || null);

}






