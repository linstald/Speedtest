# Speedtest
This little application runs internet speedtests periodically (currently 15 minutes but can be changed in `index.js`) and displays them on local hosted website.
Use it to have a longterm internet bandwidth analysis of your host.

## Requirements
In order to run the speedtests you have to install the [Speedtest CLI](https://www.speedtest.net/de/apps/cli) and add it to your path.

## Usage
To run the speedtest application locally run:
```
npm install
node index.js
```

On [localhost:8080](http://localhost:8080/) you see your speedtests visualized.

## Endpoints

- /: Visualization of the speedtests.
- /data: JSON data of all the speedtests.
- /reset: resets the database.
