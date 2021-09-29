function getData() {
    fetch('/data')
        .then((res)=> res.json())
        .then((data)=>processData(data));
}
function processData(data) {    
    initGlobalVars(data);
    document.getElementById('content').innerHTML = `Average ping: ${avgping}ms</br> Average download: ${avgdown}Mbps</br> Average upload: ${avgup}Mbps`;

    //initialize entries
    const r = min((width-legendw)/data.length/4, 10/ymax*height);
    entries = data.map((e)=>{
        const time = Date.parse(e.timestamp);
        const upload = e.upload.bandwidth/125000;
        const download = e.download.bandwidth/125000;
        let edata = {
            "time": time,
            "timestamp": e.timestamp,
            "upload": upload,
            "download": download,
            "ping": e.ping.latency,
            "x": map(time, xmin, xmax, legendw, width),
            "yD": map(download, 0, ymax, height-legendh, 0),
            "yU": map(upload, 0, ymax, height-legendh, 0),
            "r": r
        };
        return new Entry(edata);
    });
    //now the data is ready and draw can kick in
    ready = true;
}

function initGlobalVars(data) {
    //min/max/avg vars
    const n = data.length;

    const timesorted =[...data].map((e)=>Date.parse(e.timestamp)).sort()
    xmin = timesorted[0]-1000;
    xmax = timesorted[n-1]+1000;

    const uploadsorted = [...data].map((e)=>e.upload.bandwidth/125000).sort((a, b)=>a-b);
    minup = uploadsorted[0];
    maxup = uploadsorted[n-1];
    avgup = uploadsorted.reduce((a, b)=>a+b)/n;

    const downloadsorted = [...data].map((e)=>e.download.bandwidth/125000).sort((a,b)=>a-b);
    mindown = downloadsorted[0];
    maxdown = downloadsorted[n-1];
    avgdown = downloadsorted.reduce((a,b)=>a+b)/n;

    const pingsorted = [...data].map((e)=>e.ping.latency).sort((a,b)=>a-b);
    minping = pingsorted[0];
    maxping = pingsorted[n-1];
    avgping = pingsorted.reduce((a,b)=>a+b)/n;

    ymax = 1.3*max(mindown, maxdown);
    
    //bestfit
    bestLegend = bestFit();

} 

function bestFit() {
    const textw = 60;
    const des = floor((width-legendw)/textw);
    const len = xmax -xmin;
    const unitmap = [
        {
            "unit": "h",
            "inc": 2,
            "max": 18,
            "time": 3600000
        },
        {
            "unit": "d",
            "inc": 2,
            "max": 5,
            "time":86400000
        },
        {
            "unit": "w",
            "inc": 1,
            "max": 3,
            "time": 604800000
        },
        {
            "unit": "M",
            "inc": 1,
            "max": 11,
            "time": 2629800000
        },
        {
            "unit": "y",
            "inc": 1,
            "max": 10,
            "time": 31556952000
        }
    ];
    let min = {
        "unit": unitmap[0].unit,
        "amount": 1,
        "time": unitmap[0].time,
        "err": abs(floor(len/unitmap[0].time)-des)
    }
    for(let u of unitmap) {
        for(let am = 1; am<=u.max; am+=u.inc) {
            const err = abs(floor(len/(am*u.time))-des);
            if(err<min.err) {
                min.unit = u.unit;
                min.amount = am;
                min.time = u.time;
                min.err = err;
            }
        }
    }
    return min
}
