/* Dependencies */
var ETCarsClient = require('etcars-node-client');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const notifier = require('node-notifier');
var os = require('os');
const fs = require('fs');
var etcars = new ETCarsClient();
request = new XMLHttpRequest();

/* Debug */
etcars.enableDebug = true;

/* API-Connection */
request.onload = function () {
    if(this.status === 200){
        notifier.notify({
            title: 'Ace Logistics',
            message: 'Job submitted.',
            icon: "logo.jpg",
            timeout: 1
        });
        console.log("API connection successful:");
        console.log(this.responseText);
        sente = "true";
    }
    else if (retrys < 10) {
        retrys = retrys + 1;
        console.log("API-Connection failed. Ensure network connection! Retry: "+retrys+"");
        notifier.notify({
            title: 'Ace Logistics',
            message: 'Connection failed. Ensure network connection! Retry: '+retrys+'',
            icon: "logo.jpg",
            timeout: 1
        });
    } else if (retrys > 9) {
        console.log("API-Connection failed. Ensure network connection! Cancelled.");
        notifier.notify({
            title: 'Ace Logistics',
            message: 'Connection failed. Ensure network connection!',
            icon: "logo.jpg",
            timeout: 1
        });
        retrys = 0;
        sente = "true";
        let r = Math.random().toString(36).substring(7);
        console.log("Job-Data stored into "+r+".json.");
        fs.writeFile(''+r+'.json', JSON.stringify(words), function (err) {
            if (err) throw err;
        });
    }
};

etcars.on('data', function (data) {
    console.log('Data updated.');
    //console.log(data); // !!"//" this line out if you dont want to flood the console!!
    var sourceCity = data.jobData.sourceCity;
    var sourceCompany = data.jobData.sourceCompany;
    var destinationCity = data.jobData.destinationCity;
    var destinationCompany = data.telemetry.job.destinationCompany;
    var truckBrand = data.jobData.truckMake;
    var gameType = data.jobData.game; //Ats or ETS2
    var topSpeed = data.jobData.topSpeed;
    var timeDue = data.jobData.timeDue;
    var collisionCount = data.jobData.collisionCount;
    var fuel = data.jobData.fuelBurned;
    var odometer = data.jobData.odometer; // distace driven
    var realTimeTaken = data.jobData.realTimeTaken;
    var realTimeStarted = data.jobData.realTimeStarted;
    var realTimeEnded = data.jobData.realTimeEnded;
    var cargo = data.jobData.cargo;
    var income = data.jobData.income;
    var masse = data.telemetry.job.mass;
    var distanceDriven = data.jobData.distanceDriven;
    var timeDelivered = data.jobData.timeDelivered;
    var timeStarted = data.jobData.timeStarted;
    var steamID = data.telemetry.user.steamID;
    var steamUsername = data.telemetry.user.steamUsername;
    var status = data.jobData.status;
    words = data;
    //console.log(words);
    fs.writeFileSync(
        'backup.json',
        JSON.stringify(words)
    );
    
    if (((status == "2") && (sente == "false")) || ((status == "3") && (sente == "false"))) {
        request.open('POST', 'https://api.d1strict.net/al/add', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        console.log('Job finished, Connecting...');
        request.send('sourcecity='+sourceCity+'&sourcecompany='+sourceCompany+'&destinationcity='+destinationCity+'&destinationcompany='+destinationCompany+'&truckbrand='+truckBrand+'&gametype='+gameType+'&topspeed='+topSpeed+'&timedue='+timeDue+'&collisioncount='+collisionCount+'&fuel='+fuel+'&odometer='+odometer+'&realtimetaken='+realTimeTaken+'&realtimestarted='+realTimeStarted+'&cargo='+cargo+'&income='+income+'&mass='+masse+'&distancedriven='+distanceDriven+'&timedelivered='+timeDelivered+'&timestarted='+timeStarted+'&steamid='+steamID+'&steamusername='+steamUsername+'&status='+status+'&realtimeended='+realTimeEnded+'');
    } else if ((status == "1") && (sente == "true")) {
       sente = "false";
    }
});

etcars.on('connect', function (data) {
    console.log('connected');
    sente = "true";
    retrys = 0;
    /* Desktop-Notification */
    var userName = os.userInfo().username;
    console.log(os.userInfo().username);
    notifier.notify({
        title: 'Ace Logistics',
        message: 'Ace Logistics - Tracker initialized!' + '\nHi ' + userName + ', have a great game!',
        icon: "logo.jpg",
        timeout: 1
    });
});

/* Error */
etcars.on('error', function (data) {
    console.log('etcars error');
    notifier.notify({
        title: 'Ace Logistics',
        message: 'An error has occurred, the Ace Logistics - Tracker could not be started.',
        icon: "logo.jpg",
        timeout: 1
    });
});


etcars.connect();