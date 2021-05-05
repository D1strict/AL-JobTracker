var ETCarsClient = require('etcars-node-client');
var etcars = new ETCarsClient();
// to enable debug console.log and console.error
etcars.enableDebug = true;
const fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
request = new XMLHttpRequest();
request.open("POST", 'https://api.d1strict.net/add/', true);
request.setRequestHeader('Content-Type', 'application/json');
const notifier = require('node-notifier');
notifier.notify({
    title: 'Ace Logistics',
    message: 'Ace Logistics Tracker Started!',
    icon: "logo.jpg",
    timeout: 1
});

etcars.on('data', function (data) {
    console.log('data received');
    //console.log(data); // !!"//" this line out if you dont want to flood the console!!
    var sourceCity = data.jobData.sourceCity;
    var sourceCompany = data.jobData.sourceCompany;
    var destinationCity = data.jobData.destinationCity;
    var destinationCompany = data.jobData.destinationCompany;
    var truckBrand = data.jobData.truckMake;
    var gameType = data.jobData.game; //Ats or ETS2
    var topSpeed = data.jobData.topSpeed;
    var timeDue = data.jobData.timeDue;
    var collisionCount = data.jobData.collisionCount;
    var fuel = data.jobData.fuel;
    var odometer = data.jobData.odometer; // distace driven
    var realTimeTaken = data.jobData.realTimeTaken;
    var realTimeStarted = data.jobData.realTimeStarted;
    var cargo = data.jobData.cargo;
    var income = data.jobData.income;
    var mass = data.jobData.mass;
    var distanceDriven = data.jobData.distanceDriven;
    var timeDelivered = data.jobData.timeDelivered;
    var timeStarted = data.jobData.timeStarted;

    var words = data;
    //console.log(words);
    fs.writeFileSync(
        'data.json',
        JSON.stringify(words)
    );

    request.open("POST", 'https://api.d1strict.net/add/', true);
    request.send(JSON.stringify({
        sourcecity: sourceCity,
        sourcecompany: sourceCompany,
        destinationcity: destinationCity,
        destinationcompany: destinationCompany,
        truckbrand: truckBrand,
        gametype: gameType,
        topspeed: topSpeed,
        timedue: timeDue,
        collisioncount: collisionCount,
        fuel: fuel,
        odometer: odometer,
        realtimetaken: realTimeTaken,
        realtimestarted: realTimeStarted,
        cargo: cargo,
        income: income,
        Mass: mass,
        distancedriven: distanceDriven,
        timedelivered: timeDelivered,
        timestarted: timeStarted,
    }));
});

etcars.on('connect', function (data) {
    console.log('connected');
    notifier.notify({
        title: 'Ace Logistics',
        message: 'Ace Logistics Tracker Initialized!',
        icon: "logo.jpg",
        timeout: 1
    });
});

etcars.on('error', function (data) {
    console.log('etcars error');
});

let data = "Hello world."

function save() {
    fsLibrary.writeFile('log.txt', fuel, (error) => { 
        if (error) throw err;
    })
}

etcars.connect();