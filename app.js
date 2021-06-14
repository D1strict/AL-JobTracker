var ETCarsClient = require('etcars-node-client');
const notifier = require('node-notifier');
const path = require('path');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
var etcars = new ETCarsClient();
var request = new XMLHttpRequest();
var map = new XMLHttpRequest();
var updateserver = new XMLHttpRequest();
 
// to enable debug console.log and console.error
etcars.enableDebug = false;
 
etcars.on('data', function(data) {
    console.log('data received');
    var isMultiplayer = data.jobData.isMultiplayer; /* Return: Boolean */
    var isPaused = data.telemetry.game.paused; /* Return: Boolean */
    var isDriving = data.telemetry.game.isDriving; /* Return:: Boolean */
    var gameID = data.telemetry.game.gameID; /* Return: ets2 or ats */
    var gameName = data.telemetry.game.gameName; /* Return: Euro Truck Simulator 2 or American Truck Simulator */
    var truckMake = data.telemetry.truck.make; /* Return: String */
    var truckModel = data.telemetry.truck.model; /* Return: String */
    var truckPositionX = data.telemetry.truck.worldPlacement.x; /* X-Coordinate of the Truck */
    var truckPositionY = data.telemetry.truck.worldPlacement.y; /* Y-Coordinate of the Truck */
    var truckPositionZ = data.telemetry.truck.worldPlacement.z; /* Z-Coordinate of the Truck */
    var jobRemainingTime = data.jobData.timeRemaining; /* Remaining time, until the delivery will be late */
    var steamID = data.telemetry.user.steamID; /* Steam-UserID */
    var steamUsername = data.telemetry.user.steamUsername; /* Steam-Username */
    var currentSpeed = data.telemetry.truck.speed; /* Current Speed */
    var currentJobDestination = data.telemetry.job.destinationCity; /* Current Job-Destination*/
    var currentJobSource = data.telemetry.job.sourceCity; /* Current Job-Source */
    var eta = data.telemetry.navigation.lowestDistance; /* ETA */
    var jobStatus = data.jobData.status; /* 1 = In progress, 2 = Finished, 3 = Cancelled */
    var currentFuel = data.telemetry.truck.fuel.currentLitres; /* Current fuel in l */
    map.open('POST', 'https://api.d1strict.net/al/v2/map', true);
    map.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    map.send('x='+truckPositionX+'&y='+truckPositionY+'&z='+truckPositionZ+'&isDriving='+isDriving+'&isPaused='+isPaused+'&jobRemainingTime='+jobRemainingTime+'&steamID='+steamID+'&steamUsername='+steamUsername+'&currentSpeed='+currentSpeed+'&currentDestination='+currentJobDestination+'&eta='+eta+'&currentFuel='+currentFuel+'&currentSource='+currentJobSource+'&gameID='+gameID+'&truckMake='+truckMake+'&truckModel='+truckModel+'');
    if (((jobStatus == "2") && (apistatus == "true")) || ((jobStatus == "3") && (apistatus == "true"))) {
        var jobCargo = data.jobData.cargo; /* Name of cargo */
        var jobCargoID = data.jobData.cargoID; /* ID of cargo */
        var jobMass = data.jobData.trailerMass; /* Mass of cargo in kg */
        var jobExIncome = data.jobData.income; /* Total expected income */
        var jobSourceCity = data.jobData.sourceCity; /* Name of the Sourcecity */
        var jobSourceCityID = data.jobData.sourceCityID; /* ID of the Sourcecity */
        var jobSourceCompany = data.jobData.sourceCompany; /* Name of the Sourcecompany */
        var jobsourceCompanyID = data.jobData.sourceCompanyID; /* ID of the Sourcecompany */
        var jobDestinationCity = data.jobData.destinationCity; /* Name of the Destination-City */
        var jobDestinationCityID = data.jobData.destinationCityID; /* ID of the Destination-City */
        var jobDestinationCompany = data.jobData.destinationCompany; /* Name of the Destination-Company */
        var jobDestinationCompanyID = data.jobData.destinationCompanyID; /* ID of the Destination-Company */
        var jobIsLate = data.jobData.isLate; /* Return: Boolean */
        var jobFineSpeeding = data.jobData.speedingCount; /* Counts of Speeding-Incidents */
        var jobDistanceDriven = data.jobData.distanceDriven; /* Driven KM */
        var jobFuelBurned = data.jobData.fuelBurned; /* Burned fuel in l */
        var jobFuelPurchased = data.jobData.fuelPurchased; /* Purchased fuel in l */
        var jobFineCollisions = data.jobData.collisionCount; /* Counts of Collisions */
        var jobTrailerStartDamage = data.jobData.startTrailerDamage; /* Damage at the start of the job */
        var jobTrailerFinishDamage = data.jobData.finishTrailerDamage; /* Damage at the finish of the job */
        var jobEngineStartDamage = data.jobData.startEngineDamage; /* Damage of the engine at the start of the job */
        var jobTransmissionStartDamage = data.jobData.startTransmissionDamage; /* Damage of the transmission at the start of the job */
        var jobCabinStartDamage = data.jobData.startCabinDamage; /* Damage of the cabin at the start of the job */
        var jobChassisStartDamage = data.jobData.startChassisDamage; /* Damage of the Chassis at the start of the job */
        var jobWheelStartDamage = data.jobData.startWheelDamage; /* Damage of the Wheels at the start of the job */
        var jobEngineFinishDamage = data.jobData.startEngineDamage; /* Damage of the engine at the end of the job */
        var jobTransmissionFinishDamage = data.jobData.startTransmissionDamage; /* Damage of the transmission at the end of the job */
        var jobCabinFinishDamage = data.jobData.startCabinDamage; /* Damage of the cabin at the end of the job */
        var jobChassisFinishDamage = data.jobData.startChassisDamage; /* Damage of the Chassis at the end of the job */
        var jobWheelFinishDamage = data.jobData.startWheelDamage; /* Damage of the Wheels at the end of the job */
        var jobRealTimeStarted = data.jobData.realTimeStarted; /* Real-Time, when the delivery was picked up */
        var jobRealTimeEnded = data.jobData.realTimeEnded; /* Real-Time, when the delivery was finished */
        var jobRealTimeTaken = data.jobData.realTimeTaken; /* Real-TIme, spent on the delivery */
        request.open('POST', 'https://api.d1strict.net/al/v2/add', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        console.log('Job finished, Connecting...');
        request.send('isMultiplayer='+isMultiplayer+'&gameID='+gameID+'&gameName='+gameName+'&truckMake='+truckMake+'&truckModel='+truckModel+'&jobStatus='+jobStatus+'&jobCargo='+jobCargo+'&jobCargoID='+jobCargoID+'&jobMass='+jobMass+'&jobExIncome='+jobExIncome+'&jobSourceCity='+jobSourceCity+'&jobSourceCityID='+jobSourceCityID+'&jobSourceCompany='+jobSourceCompany+'&jobSourceCompanyID='+jobsourceCompanyID+'&jobDestinationCity='+jobDestinationCity+'&jobDestinationCityID='+jobDestinationCityID+'&jobDestinationCompany='+jobDestinationCompany+'&jobDestinationCompanyID='+jobDestinationCompanyID+'&isLate='+jobIsLate+'&jobFineSpeeding='+jobFineSpeeding+'&jobDistanceDriven='+jobDistanceDriven+'&jobFuelBurned='+jobFuelBurned+'&jobFuelPurchased='+jobFuelPurchased+'&jobFineCollisions='+jobFineCollisions+'&jobTrailerStartDamage='+jobTrailerStartDamage+'&jobTrailerFinishDamage='+jobTrailerFinishDamage+'&jobEngineStartDamage='+jobEngineStartDamage+'&jobEngineFinishDamage='+jobEngineFinishDamage+'&jobTransmissionStartDamage='+jobTransmissionStartDamage+'&jobTransmissionFinishDamage='+jobTransmissionFinishDamage+'&jobCabinStartDamage='+jobCabinStartDamage+'&jobCabinFinishDamage='+jobCabinFinishDamage+'&jobChassisStartDamage='+jobChassisStartDamage+'&jobChassisFinishDamage='+jobChassisFinishDamage+'&jobWheelStartDamage='+jobWheelStartDamage+'&jobWheelFinishDamage='+jobWheelFinishDamage+'&jobRealTimeStarted='+jobRealTimeStarted+'&jobRealTimeTaken='+jobRealTimeTaken+'&jobRealTimeEnded='+jobRealTimeEnded+'&steamID='+steamID+'&steamUsername='+steamUsername+'');
    } else if ((jobStatus == "1") && (apistatus == "false")) {
       apistatus = "true";
    }
});

request.onload = function () {
    if(this.status === 200){
        notifier.notify({
            title: 'Ace Logistics',
            message: 'Job submitted.',
            icon: "logo.png",
            timeout: 1,
            appID: "Ace Logistics - JobTracker"
        });
        console.log("API connection successful:");
        console.log(this.responseText);
        apistatus = "false";
    }
    else if (retryCount < 10) {
        retryCount = retryCount + 1;
        console.log("API-Connection failed. Please check your internet connection! Retry: "+retryCount+"");
    } else if (retryCount > 9) {
        console.log("API-Connection failed. Please check your internet connection! Cancelled.");
        notifier.notify({
            title: 'Ace Logistics',
            message: 'API-Connection failed.',
            icon: "logo.png",
            timeout: 1,
            appID: "Ace Logistics - JobTracker"
        });
        retryCount = 0;
        apistatus = "false";
    }
};
 
etcars.on('connect', function(data) {
    retryCount = 0;
    apistatus = "false";
    console.log('connected');
});
 
etcars.on('error', function(data) {
    console.log('etcars error');
});
 
etcars.connect();
notifier.notify({
    title: 'Ace Logistics',
    message: 'Tracker started.',
    icon: "logo.png",
    timeout: 1,
    appID: "Ace Logistics - JobTracker"
});


updateserver.open("GET", "https://api.d1strict/al/v2/appversion.txt");
updateserver.send();
updateserver.onreadystatechange=function(){
  if(this.readyState==4 && this.status==200){ 
    if (updateserver.responseText > version){
        notifier.notify({
            title: 'Ace Logistics',
            message: 'Update available.',
            icon: "logo.png",
            timeout: 1,
            appID: "Ace Logistics - JobTracker"
        });
    }
  }  
}