let legendw; //offset to the canvas (for legend)
let legendh;

let entries; //entry array (consists of Entry objects)

let maxdown; //maximal download
let maxup; //maximal upload
let mindown; //minimal download
let minup; //minimal upload
let minping; //minimal ping
let maxping; //maximal ping
let avgdown; //average download
let avgup; //average upload
let avgping; //average ping

let xmin; //xmin = min timestamp
let xmax; //xmax = max timestamp
const ymin = 0; //ymin = 0
let ymax; //ymax = 1.3*maxbandwidth

let ready; //true iff data ready

let bestLegend; //used for drawing scale

function preload() {
    legendw = 100;
    legendh = 30;
    entries = [];
    ready = false;
}
function setup() {
    createCanvas(800+legendw, 500+legendh);
    background(190);
    getData();
    frameRate(25);
}

function draw() {
    if(!ready) {
        return;
    }
    if(frameCount%(25*100)==0) {
        getData();
    }
    background(190);
    connectEntries();
    drawLegend();
    for(let e of entries) {
        e.show();
    }
    for(let e of entries) {
        e.showInfo();
    }
    
}

function connectEntries() {
    let px = entries[0].data.x;
    let pyD = entries[0].data.yD;
    let pyU = entries[0].data.yU;
    for(let e of entries) {
        line(px, pyD, e.data.x, e.data.yD);
        line(px, pyU, e.data.x, e.data.yU);
        px = e.data.x;
        pyD = e.data.yD;
        pyU = e.data.yU;
    }
}

function drawLegend() {
    //bandwidth
    for(let j = 0; j<=ymax; j+=10) {
        let y = map(j, 0, ymax, height-legendh, 0);
        const w = legendw/50;
        fill(0, 0, 0, 60);
        for(let i = legendw;i<=width;i+=2*w) {
            line(i, y, i+w, y);
        }
        fill(0);
        line(0, y, legendw/3, y);
        text(`${j} Mbps`, legendw/3+2, y);
    }
    //time uses best fitting scale
    for(let i = xmax, a = 0; i>xmin; i-=(bestLegend.amount*bestLegend.time),a++) {
        let x = map(i, xmin, xmax, legendw, width);
        fill(0);
        line(x, height, x, height-legendh/2);
        if(i!=xmax) {
            text(`-${a*bestLegend.amount}${bestLegend.unit}`, x, height-legendh/2);
        }
    } 
}

