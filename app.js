/* Dependencies */
var ETCarsClient = require('etcars-node-client');
const notifier = require('node-notifier');
const path = require('path');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
var etcars = new ETCarsClient();
var request = new XMLHttpRequest();
var map = new XMLHttpRequest();
var updateserver = new XMLHttpRequest();
const http = require('http');
const rp = require('request-promise');
var open = require('open');
const SysTray = require('systray2').default;
const os = require('os');
/* Configuration */
etcars.enableDebug = false; /* to enable debug console.log and console.error */
var devmode = 0; /* Developer mode: 1 - Active - Advanced outputs in the console, 0 = Production mode (no outputs in the console). */
var version = 2; /* Versionnumber (not Semantic) */
const AlTPort = 10853; /* Port for the process check (should be a port which is not commonly) */
const AlTPath = '/AlT'; /* Random path. Should not contain special characters or umlauts. */
/* Process-Checking (is it running already) */
rp({
	uri: `http://localhost:${AlTPort}${AlTPath}`,
	resolveWithFullResponse: true
}).then(res => {
	if (res.statusCode === 200) {
		notifier.notify({
			title: 'Ace Logistics',
			message: 'Error: Tracker could not be started, it is already running.',
			icon: "./src/media/error.png",
			timeout: 1,
			appID: "Ace Logistics - JobTracker",
			sound: true,
			wait: false
		});
		setTimeout(() => {
			process.exit(1);
			systray.kill();
		}, 2000);
	} else {
		throw new Error(`statusCode ${res.statusCode}`)
	}
}).catch(err => {
	const server = http.createServer((req, res) => {
		if (req.url === AlTPath) {
			res.statusCode = 200;
			res.end("ok");
		} else {
			res.statusCode = 404;
			res.end("err");
		}
	});
	server.listen(AlTPort);
	server.unref();
	// proceed with the rest of your process initialization here
	console.log("Tracker is running.");
	if (devmode == 1) {
		console.log("Process-Check successfully. Continue.");
	}
	etcars.connect();
	notifier.notify({
		title: 'Ace Logistics',
		message: 'Info: Tracker started.',
		icon: "./src/media/info.png",
		timeout: 1,
		appID: "Ace Logistics - JobTracker",
		sound: true,
		wait: false
	});
	if (devmode == 1) {
		setInterval(() => {
			console.log("still running");
		}, 1000);
	}
});
/* Update-Check */
updateserver.open("GET", "https://api.d1strict.net/al/v2/appversion.txt");
updateserver.send();
updateserver.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		if (updateserver.responseText > version) {
			notifier.notify({
				title: 'Ace Logistics',
				message: 'Info: Update available.',
				icon: "./src/media/info.png",
				timeout: 1,
				appID: "Ace Logistics - JobTracker",
				sound: true,
				wait: true
			}, function() {
				open('https://discord.gg/WrMg4CmVve');
			});
		}
	}
}
/* Ingame-Data */
etcars.on('data', function(data) {
	if (devmode == 1) {
		console.log('Data received.');
	}
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
	map.open('POST', 'https://api.d1strict.net/al/v2/map', true); /* Open the request to the Map API. */
	map.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); /* Sets the request header for the Map API */
	map.send('x=' + truckPositionX + '&y=' + truckPositionY + '&z=' + truckPositionZ + '&isDriving=' + isDriving + '&isPaused=' + isPaused + '&jobRemainingTime=' + jobRemainingTime + '&steamID=' + steamID + '&steamUsername=' + steamUsername + '&currentSpeed=' + currentSpeed + '&currentDestination=' + currentJobDestination + '&eta=' + eta + '&currentFuel=' + currentFuel + '&currentSource=' + currentJobSource + '&gameID=' + gameID + '&truckMake=' + truckMake + '&truckModel=' + truckModel + ''); /* Sends data to the Map API. */
	if (devmode == 1) {
		console.log('Position sent to the Map-API.');
	}
	if (((jobStatus == "2") && (apistatus == "true")) || ((jobStatus == "3") && (apistatus == "true"))) /* Check if the job has not been sent yet and if it has been finished */ {
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
		request.open('POST', 'https://api.d1strict.net/al/v2/add', true); /* Open the request to the Job-API. */
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); /* Sets the request header for the Job-API */
		if (devmode == 1) {
			console.log('Job finished, Connecting...');
		}
		var data = fs.readFileSync('./apikey.txt', 'utf8');
    	console.log(data.toString());  
		request.send('isMultiplayer=' + isMultiplayer + '&gameID=' + gameID + '&gameName=' + gameName + '&truckMake=' + truckMake + '&truckModel=' + truckModel + '&jobStatus=' + jobStatus + '&jobCargo=' + jobCargo + '&jobCargoID=' + jobCargoID + '&jobMass=' + jobMass + '&jobExIncome=' + jobExIncome + '&jobSourceCity=' + jobSourceCity + '&jobSourceCityID=' + jobSourceCityID + '&jobSourceCompany=' + jobSourceCompany + '&jobSourceCompanyID=' + jobsourceCompanyID + '&jobDestinationCity=' + jobDestinationCity + '&jobDestinationCityID=' + jobDestinationCityID + '&jobDestinationCompany=' + jobDestinationCompany + '&jobDestinationCompanyID=' + jobDestinationCompanyID + '&isLate=' + jobIsLate + '&jobFineSpeeding=' + jobFineSpeeding + '&jobDistanceDriven=' + jobDistanceDriven + '&jobFuelBurned=' + jobFuelBurned + '&jobFuelPurchased=' + jobFuelPurchased + '&jobFineCollisions=' + jobFineCollisions + '&jobTrailerStartDamage=' + jobTrailerStartDamage + '&jobTrailerFinishDamage=' + jobTrailerFinishDamage + '&jobEngineStartDamage=' + jobEngineStartDamage + '&jobEngineFinishDamage=' + jobEngineFinishDamage + '&jobTransmissionStartDamage=' + jobTransmissionStartDamage + '&jobTransmissionFinishDamage=' + jobTransmissionFinishDamage + '&jobCabinStartDamage=' + jobCabinStartDamage + '&jobCabinFinishDamage=' + jobCabinFinishDamage + '&jobChassisStartDamage=' + jobChassisStartDamage + '&jobChassisFinishDamage=' + jobChassisFinishDamage + '&jobWheelStartDamage=' + jobWheelStartDamage + '&jobWheelFinishDamage=' + jobWheelFinishDamage + '&jobRealTimeStarted=' + jobRealTimeStarted + '&jobRealTimeTaken=' + jobRealTimeTaken + '&jobRealTimeEnded=' + jobRealTimeEnded + '&steamID=' + steamID + '&steamUsername=' + steamUsername + '&apikey=' + data.toString() + ''); /* Sends data to the Map API. */
	} else if ((jobStatus == "1") && (apistatus == "false")) {
		apistatus = "true";
	}
});
request.onload = function() {
	if (this.status === 200) {
		notifier.notify({
			title: 'Ace Logistics',
			message: 'Info: Job submitted.',
			icon: "./src/media/success.png",
			timeout: 1,
			appID: "Ace Logistics - JobTracker",
			sound: true,
			wait: false
		});
		if (devmode == 1) {
			console.log("API connection successful:");
			console.log(this.responseText);
		}
		apistatus = "false";
	} else if (retryCount < 10) {
		retryCount = retryCount + 1;
		if (devmode == 1) {
			console.log("API-Connection failed. Please check your internet connection! Retry: " + retryCount + "");
		}
	} else if (retryCount > 9) {
		if (devmode == 1) {
			console.log("API-Connection failed. Please check your internet connection! Cancelled.");
		}
		notifier.notify({
			title: 'Ace Logistics',
			message: 'Error: API-Connection failed.',
			icon: "./src/media/error.png",
			timeout: 1,
			appID: "Ace Logistics - JobTracker",
			sound: true,
			wait: true
		}, function() {
			open('https://d1strict.de/form-user-response/10-submit-a-job/');
		});
		retryCount = 0;
		apistatus = "false";
	}
};
etcars.on('connect', function(data) {
	retryCount = 0;
	apistatus = "false";
	if (devmode == 1) {
		console.log('connected');
	}
});
etcars.on('error', function(data) {
	if (devmode == 1) {
		console.log('etcars error');
	}
});
/* Systray */
const AceLogistcsMenu = {
	title: 'Ace Logistics',
	checked: false,
	enabled: true,
	items: [{
			title: 'Website',
			checked: false,
			enabled: true
		},
		{
			title: 'Submit a Job',
			checked: false,
			enabled: true
		},
		{
			title: 'Support',
			checked: false,
			enabled: true
		},
		{
			title: 'Check for Updates',
			checked: false,
			enabled: true
		},
	]
}
const RestartTrackerButton = {
	title: 'Restart',
	checked: false,
	enabled: true,
	click: () => {
		RestartApplication();
	}
}
const ExitTrackerButton = {
	title: 'Exit',
	checked: false,
	enabled: true,
	click: () => {
		ExitApplication();
	}
}
const UpdateTrackerButton = {
	title: 'Check for Updates',
	checked: false,
	enabled: true,
	click: () => {
		UpdateApplication();
	}
}
const systray = new SysTray({
	menu: {
		// you should use .png icon on macOS/Linux, and .ico format on Windows */
		icon: os.platform() === 'win32' ? './src/media/systray.ico' : './src/media/systray.png',
		title: 'Ace Logistics',
		tooltip: 'Ace Logistics',
		items: [
			AceLogistcsMenu,
			RestartTrackerButton,
			UpdateTrackerButton,
			ExitTrackerButton
		]
	},
	debug: false,
	copyDir: false // copy go tray binary to outside directory, useful for packing tool like pkg. */
})
//Functions */
function ExitApplication() {
	// Doesn't appears 
	notifier.notify({
		title: 'Ace Logistics',
		message: 'Warning: The tracker has been terminated. Jobs are not logged until you start the JobTracker again.',
		icon: "./src/media/warning.png",
		timeout: 1,
		appID: "Ace Logistics - JobTracker",
		sound: true,
		wait: false
	});
	setTimeout(() => {
		process.exit(1);
		systray.kill();
	}, 1000);
}

function UpdateApplication() {
	updateserver.open("GET", "https://api.d1strict.net/al/v2/appversion.txt");
	updateserver.send();
	updateserver.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if (updateserver.responseText > version) {
				notifier.notify({
					title: 'Ace Logistics',
					message: 'Info: Update available.',
					icon: "./src/media/info.png",
					timeout: 1,
					appID: "Ace Logistics - JobTracker",
					sound: true,
					wait: true
				}, function() {
					open('https://discord.gg/WrMg4CmVve');
				});
			}
		}
	}
}

function RestartApplication() {
	setTimeout(function() {
		process.on("exit", function() {
			require("child_process").spawn(process.argv.shift(), process.argv, {
				cwd: process.cwd(),
				detached: true,
				stdio: "inherit"
			});
		});
		process.exit();
	}, 3000);
}
//Systray Update */
systray.onClick(action => {
	if (action.item.click != null) {
		action.item.click()
	}
})
systray.onClick(action => {
	if (action.seq_id === 0) { //Ace Logistics Homepage Button
		open('https://ace-logistics.uk');
	} else if (action.seq_id === 1) { //sumbit a job button
		open('https://d1strict.de/form-user-response/10-submit-a-job/');
	} else if (action.seq_id === 2) { //Help button
		open('https://discord.gg/WrMg4CmVve');
	}
})