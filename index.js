const {execSync} = require('child_process');
const fs = require('fs');
const express = require('express');

const app = express();
const database = 'speedtests.txt';
const time = {
    "second": 1000,
    "minute": 60000,
    "hour": 3600000,
    "day": 86400000,
}
const period = 15*time.minute;


/**
 * reads the database, parses and returns it as an array of JSON objects
 */
function getJson() {
    const data = fs.readFileSync(database).toString().split('\r\n').filter(entry=>entry.startsWith('{'));
    return data.map((entry)=>JSON.parse(entry)).filter((entry)=>entry.type=="result");
}

/**
 * runs the speedtest (requires that Ookla speedtest cli is installed)
 * database gets updated and result is logged
 */
function runSpeedtest() {
    try {
        execSync(`speedtest -fjson >> ${database}`);
        const json = getJson();
        const res = json[json.length-1];
        console.log(`speedtest executed. ping: ${res.ping.latency}ms, download: ${res.download.bandwidth/125000}Mbps, upload: ${res.upload.bandwidth/125000}Mbps`);
    }catch(err) {
        console.error(`speedtest failed: \n\x1b[31m${err}\x1b[39m`)
    }
    
}



//serve webserver
app.use(express.static('./public'));
app.get('/data', (req, res)=> {
    res.send(getJson());
});

app.delete('/reset', (req, res)=>{
    fs.writeFileSync(database, '');
})
const server = app.listen(8080, console.log("\x1b[92mserver listening on port 8080\x1b[39m"));
//test speed each period
setInterval(runSpeedtest, period)