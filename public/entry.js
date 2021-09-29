class Entry {
    constructor(data) {
        this.data = data;
    }

    show = function() {
        if(this.data.download==maxdown) {
            fill(30, 255, 30, 150);
        } else if(this.data.download==mindown) {
            fill(255, 30, 30,150);
        }else {
            fill(30, 30, 255, 150);
        }
        circle(this.data.x, this.data.yD, this.data.r);
        if(this.data.upload==maxup) {
            fill(150, 255, 150, 150);
        }else if(this.data.upload==minup) {
            fill(255,150,150,150);
        }else {
            fill(150,150, 255, 150);
        }
        circle(this.data.x, this.data.yU, this.data.r);
        
    }

    showInfo = function() {
        if(!this.mouseOver()) {
            return;
        }
        fill(130);
        const pwabs = 200;
        const phabs = 100;
        let pw = mouseX+pwabs>width?-pwabs: pwabs;
        let ph = mouseY-phabs<0?0:-phabs;
        rect(mouseX, mouseY+ph, pw, phabs);
        fill(0);
        const rcx = mouseX+(pw<0?pw:0);
        const rcy = mouseY+ph;
        const offset = 15;
        text(`Date: ${this.data.timestamp}`, rcx+offset, rcy+offset);
        text(`Download: ${this.data.download}`, rcx+offset, rcy+2*offset);
        text(`Upload: ${this.data.upload}`, rcx+offset, rcy+3*offset);
        text(`Ping: ${this.data.ping}`, rcx+offset, rcy+4*offset);
    }

    mouseOver = function() {
        const dx = mouseX-this.data.x;
        const dyD = mouseY-this.data.yD;
        const dyU = mouseY-this.data.yU;
        const ddx = dx*dx;
        const rr = this.data.r*this.data.r/4;
        return (ddx+dyD*dyD<rr || ddx+dyU*dyU<rr);
    }
}