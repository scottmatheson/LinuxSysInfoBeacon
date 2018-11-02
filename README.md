# Harbor SystemInformation Beacon for Linux

This beacon makes use of the excellent SystemInformation package.

Link: https://www.npmjs.com/package/systeminformation 


## Usage

1. Clone the repo from Github.
2. `yarn` to download and resolve all dependencies.
3. Configure as needed in the `options.json` (see below).
4. Register the `beaconVersionId` in the App in Harbor. The `beaconVersionId` is generated from the `package.json` `name` and `version` fields concatenated with a `:` between them. For this version it is `harbor-linux-sysinfo-beacon:0.1.0`.
5. `node src/index.js`
6. We suggest using `pm2` to run this beacon at startup automatically.

## Command Line Arguments
-v = verbose mode
-i [interval] = interval in ms for taking readings/sending beacons. 60 sec is the default.

Example:

`node src/index.js -v -i 10000&`

Verbose mode, 10s interval.

## Configuration Options (options.json)

An example JSON options file is shown below.

```
{
  "apikey": "YOUR_API_KEY_HERE",
  "beaconInstanceId": "auto:mac:en0",
  "appVersionId": "io.hrbr.mktest:1.0.0",
  "functions": [
    "fsSize",
    "currentLoad",
    "mem"
  ],
  "sampleInterval": 10,
  "server": "staging"
}
```

|     Key     |      Value     |  Required |
|-------------|----------------|-----------|
| apikey | Your Harbor API Key |    yes    |
| beaconInstanceId | Whatever you want, but if you put `auto:mac:xxx` it will use the MAC address of your network port. See below. | no |
| appVersionId | The app this Beacon is assigned to. This app must exist in your Harbor account, or beacon messages will be rejected. | yes |
| beaconVersionId | Your chosen beacon instance ID (device or system identifier) or enter `auto:mac:<if>` to use the MAC address of one of your network interfaces. For example, to use `en0` enter `auto:mac:en0`.| no, defaults to `null`|
| functions | SystemInfo functions you want to run on each pass. Refer to the SystemInformation documentation for a list of legal functions. If you attempt an illegal function, it will be flagged in the output.| no, defaults to `["cpu", "mem", "fsSize", "currentLoad"]` |
| sampleInterval | Sample interval in seconds. Overrides the command line. | no |
| server | One of "production", "staging", "local". This is for in-house testing and is normally not used. | no, default is "production" |  

### Auto Beacon Instance ID

If you use a `beaconInstanceId` of the form `auto:mac:<iface>` then the beacon will attempt to retrieve the MAC address of <iface> and use
that as the beaconInstanceId. For example, `auto:mac:en0` will look for the interface named `en0`. Any interface that has a MAC address
that shows up via `ifconfig` should work.

## Summary Info

| Item | Value | Comments |
|------|-------|----------|
| Beacon Instance ID |  harbor-linux-sysinfo-beacon:0.1.1 | *Check package.json as version may have changed* |
| Beacon Message Type(s) | SYSINFO | Sends only one type |

_NOTE: `beaconInstanceId` is automatically created by concatenating the "name" and "version" fields in the `package.json` file._

## Beacon Message Format

Beacon messages sent by this app follow the following data schema:

```{ beaconMessageType: 'SYSINFO', data: {<functionName>: {[ results ]}, ...}```

Which is probably a little confusing, so here's some real output.

```{
     "cpu": {
       "manufacturer": "Intel®",
       "brand": "Core™ i7-4960HQ",
       "vendor": "GenuineIntel",
       "family": "6",
       "model": "70",
       "stepping": "1",
       "revision": "",
       "voltage": "",
       "speed": "2.60",
       "speedmin": "2.60",
       "speedmax": "2.60",
       "cores": 8,
       "cache": {
         "l1d": 32768,
         "l1i": 32768,
         "l2": 262144,
         "l3": 6291456
       }
     },
     "mem": {
       "total": 17179869184,
       "free": 986742784,
       "used": 16193126400,
       "active": 6022656000,
       "available": 11157213184,
       "buffcache": 10170470400,
       "swaptotal": 3221225472,
       "swapused": 1803026432,
       "swapfree": 1418199040
     },
     "fsSize": [
       {
         "fs": "/dev/disk1s1",
         "type": "HFS",
         "size": 1000345825280,
         "used": 970382221312,
         "use": 97,
         "mount": "/"
       },
       {
         "fs": "/dev/disk1s4",
         "type": "HFS",
         "size": 1000345825280,
         "used": 4295708672,
         "use": 0.43,
         "mount": "/private/var/vm"
       }
     ],
     "currentLoad": {
       "avgload": 0.39,
       "currentload": 9.579341940857976,
       "currentload_user": 5.893377759266972,
       "currentload_system": 3.685964181591004,
       "currentload_nice": 0,
       "currentload_idle": 90.42065805914203,
       "currentload_irq": 0,
       "raw_currentload": 4600,
       "raw_currentload_user": 2830,
       "raw_currentload_system": 1770,
       "raw_currentload_nice": 0,
       "raw_currentload_idle": 43420,
       "raw_currentload_irq": 0,
       "cpus": [
         {
           "load": 22.462562396006653,
           "load_user": 13.311148086522461,
           "load_system": 9.151414309484194,
           "load_nice": 0,
           "load_idle": 77.53743760399334,
           "load_irq": 0,
           "raw_load": 1350,
           "raw_load_user": 800,
           "raw_load_system": 550,
           "raw_load_nice": 0,
           "raw_load_idle": 4660,
           "raw_load_irq": 0
         },
         {
           "load": 2.5,
           "load_user": 1.1666666666666667,
           "load_system": 1.3333333333333335,
           "load_nice": 0,
           "load_idle": 97.5,
           "load_irq": 0,
           "raw_load": 150,
           "raw_load_user": 70,
           "raw_load_system": 80,
           "raw_load_nice": 0,
           "raw_load_idle": 5850,
           "raw_load_irq": 0
         },
         {
           "load": 15.141430948419302,
           "load_user": 9.983361064891847,
           "load_system": 5.158069883527454,
           "load_nice": 0,
           "load_idle": 84.8585690515807,
           "load_irq": 0,
           "raw_load": 910,
           "raw_load_user": 600,
           "raw_load_system": 310,
           "raw_load_nice": 0,
           "raw_load_idle": 5100,
           "raw_load_irq": 0
         },
         {
           "load": 1.497504159733777,
           "load_user": 0.8319467554076538,
           "load_system": 0.6655574043261231,
           "load_nice": 0,
           "load_idle": 98.50249584026622,
           "load_irq": 0,
           "raw_load": 90,
           "raw_load_user": 50,
           "raw_load_system": 40,
           "raw_load_nice": 0,
           "raw_load_idle": 5920,
           "raw_load_irq": 0
         },
         {
           "load": 15.166666666666668,
           "load_user": 9.833333333333332,
           "load_system": 5.333333333333334,
           "load_nice": 0,
           "load_idle": 84.83333333333334,
           "load_irq": 0,
           "raw_load": 910,
           "raw_load_user": 590,
           "raw_load_system": 320,
           "raw_load_nice": 0,
           "raw_load_idle": 5090,
           "raw_load_irq": 0
         },
         {
           "load": 1.335559265442404,
           "load_user": 0.667779632721202,
           "load_system": 0.667779632721202,
           "load_nice": 0,
           "load_idle": 98.6644407345576,
           "load_irq": 0,
           "raw_load": 80,
           "raw_load_user": 40,
           "raw_load_system": 40,
           "raw_load_nice": 0,
           "raw_load_idle": 5910,
           "raw_load_irq": 0
         },
         {
           "load": 16.026711185308848,
           "load_user": 10.51752921535893,
           "load_system": 5.509181969949917,
           "load_nice": 0,
           "load_idle": 83.97328881469114,
           "load_irq": 0,
           "raw_load": 960,
           "raw_load_user": 630,
           "raw_load_system": 330,
           "raw_load_nice": 0,
           "raw_load_idle": 5030,
           "raw_load_irq": 0
         },
         {
           "load": 2.4958402662229617,
           "load_user": 0.8319467554076538,
           "load_system": 1.6638935108153077,
           "load_nice": 0,
           "load_idle": 97.50415973377704,
           "load_irq": 0,
           "raw_load": 150,
           "raw_load_user": 50,
           "raw_load_system": 100,
           "raw_load_nice": 0,
           "raw_load_idle": 5860,
           "raw_load_irq": 0
         }
       ]
     }
   }
   ```