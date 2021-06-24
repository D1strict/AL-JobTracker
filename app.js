/* Dependencies */
var ETCarsClient = require('etcars-node-client');
const notifier = require('node-notifier');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
var etcars = new ETCarsClient();
var request = new XMLHttpRequest();
var map = new XMLHttpRequest();
var localjobsender = new XMLHttpRequest();
var updateserver = new XMLHttpRequest();
const http = require('http');
const https = require('https');
const rp = require('request-promise');
var open = require('open');
const SysTray = require('systray2').default;
const os = require('os');
var exec = require('child_process').execFile;
const exitHook = require('exit-hook');

/* Configuration */
etcars.enableDebug = false; /* to enable debug console.log and console.error */
var devmode = 1; /* Developer mode: 1 - Active - Advanced outputs in the console, 0 = Production mode (no outputs in the console). */
var version = 2; /* Versionnumber (not Semantic) */
const AlTPort = 10853; /* Port for the process check (should be a port which is not commonly) */
const AlTPath = '/AlT'; /* Random path. Should not contain special characters or umlauts. */
var apikey = ""; /* INSERT API-KEY */


/* Functions */

var restartDRP = function() {
	if (devmode == 1) {
		console.log("Restart DRP...");
	}
	if (os.arch() == "x32") {
		exec(__dirname + '\\RebootDRP_x86.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err);
					return;
				}
				console.log(data.toString());
			}
		});
	} else if (os.arch() == "x64") {
		exec(__dirname + '\\RebootDRP_x64.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err);
					return;
				}
				console.log(data.toString());
			}
		});
	} else {
		exec(__dirname + '\\RebootDRP_x86.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err);
					return;
				}
				console.log(data.toString());
			}
		});
	}
}

var terminateDRP = function() {
	if (devmode == 1) {
		console.log("Terminate DRP...");
	}
	if (os.arch() == "x32") {
		exec(__dirname + '\\TerminateDRP_x86.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err);
					return;
				}
				console.log(data.toString());
			}
		});
	} else if (os.arch() == "x64") {
		exec(__dirname + '\\TerminateDRP_x64.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err);
					return;
				}
				console.log(data.toString());
			}
		});
	} else {
		exec(__dirname + '\\TerminateDRP_x86.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err);
					return;
				}
				console.log(data.toString());
			}
		});
	}
}

var submitLocalJobs = function() {
	fs.readdir("./jobs/", (err, files) => {
		if (err) throw err;
		files.forEach(file => {
			var jsondata = fs.readFileSync("./jobs/" + file + "", 'utf8');
			if (jsondata = " ") {
				fs.unlink()('./jobs/' + file + '', (err) => {
					if (err) throw err;
				});
			} else {
				setTimeout(() => {
					var jsonendata = JSON.parse(jsondata);
					localjobsender.open('POST', 'https://api.d1strict.net/al/v2/add', true); /* Open the request to the Job-API. */
					localjobsender.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); /* Sets the request header for the Job-API */
					if (devmode == 1) {
						console.log('Job finished, Connecting...');
					}
					if (devmode == 1) {
						console.log('Authentication with API key:' + data.toString() + '');
					}
					localjobsender.send('isMultiplayer=' + jsonendata.isMultiplayer + '&gameID=' + jsonendata.gameID + '&gameName=' + jsonendata.gameName + '&truckMake=' + jsonendata.truckMake + '&truckModel=' + jsonendata.truckModel + '&jobStatus=' + jsonendata.jobStatus + '&jobCargo=' + jsonendata.jobCargo + '&jobCargoID=' + jsonendata.jobCargoID + '&jobMass=' + jsonendata.jobMass + '&jobExIncome=' + jsonendata.jobExIncome + '&jobSourceCity=' + jsonendata.jobSourceCity + '&jobSourceCityID=' + jsonendata.jobSourceCityID + '&jobSourceCompany=' + jsonendata.jobSourceCompany + '&jobSourceCompanyID=' + jsonendata.jobsourceCompanyID + '&jobDestinationCity=' + jsonendata.jobDestinationCity + '&jobDestinationCityID=' + jsonendata.jobDestinationCityID + '&jobDestinationCompany=' + jsonendata.jobDestinationCompany + '&jobDestinationCompanyID=' + jsonendata.jobDestinationCompanyID + '&isLate=' + jsonendata.jobIsLate + '&jobFineSpeeding=' + jsonendata.jobFineSpeeding + '&jobDistanceDriven=' + jsonendata.jobDistanceDriven + '&jobFuelBurned=' + jsonendata.jobFuelBurned + '&jobFuelPurchased=' + jsonendata.jobFuelPurchased + '&jobFineCollisions=' + jsonendata.jobFineCollisions + '&jobTrailerStartDamage=' + jsonendata.jobTrailerStartDamage + '&jobTrailerFinishDamage=' + jsonendata.jobTrailerFinishDamage + '&jobEngineStartDamage=' + jsonendata.jobEngineStartDamage + '&jobEngineFinishDamage=' + jsonendata.jobEngineFinishDamage + '&jobTransmissionStartDamage=' + jsonendata.jobTransmissionStartDamage + '&jobTransmissionFinishDamage=' + jsonendata.jobTransmissionFinishDamage + '&jobCabinStartDamage=' + jsonendata.jobCabinStartDamage + '&jobCabinFinishDamage=' + jsonendata.jobCabinFinishDamage + '&jobChassisStartDamage=' + jsonendata.jobChassisStartDamage + '&jobChassisFinishDamage=' + jsonendata.jobChassisFinishDamage + '&jobWheelStartDamage=' + jsonendata.jobWheelStartDamage + '&jobWheelFinishDamage=' + jsonendata.jobWheelFinishDamage + '&jobRealTimeStarted=' + jsonendata.jobRealTimeStarted + '&jobRealTimeTaken=' + jsonendata.jobRealTimeTaken + '&jobRealTimeEnded=' + jsonendata.jobRealTimeEnded + '&steamID=' + jsonendata.steamID + '&steamUsername=' + jsonendata.steamUsername + '&apikey=' + apikey + ''); /* Sends data to the Map API. */
					filedeletion = './jobs/' + file + '';
				}, 10000);
			}
		});
	})
}

localjobsender.onload = function() {
	if (this.readyState == 4 && this.status === 200) {
		notifier.notify({
			title: 'Ace Logistics',
			message: 'Info: local Job submitted.',
			icon: "./assets/success.png",
			timeout: 1,
			appID: "Ace Logistics - JobTracker",
			sound: true,
			wait: false
		});
		fs.writeFile(filedeletion, " ", (err) => {
			if (err) throw err;
			if (devmode == 1) {
				console.log("API connection successful:");
				console.log(this.responseText);
				console.log("\nLocal job is emptied and flagged for deletion.")
			}
		})
	} else if (this.readyState == 4 && this.status != 200) {
		notifier.notify({
			title: 'Ace Logistics',
			message: 'Warning: Local jobs could not be submitted.\nCheck your internet connection.',
			icon: "./assets/warning.png",
			timeout: 1,
			appID: "Ace Logistics - JobTracker",
			sound: true,
			wait: false
		});
	}
};

/* Process-Checking */
rp({
	uri: `http://localhost:${AlTPort}${AlTPath}`,
	resolveWithFullResponse: true
}).then(res => {
	if (res.statusCode === 200) {
		notifier.notify({
			title: 'Ace Logistics',
			message: 'Error: Tracker could not be started, it is already running.',
			icon: "./assets/error.png",
			timeout: 1,
			appID: "Ace Logistics - JobTracker",
			sound: true,
			wait: false
		});
		setTimeout(() => {
			systray.kill();
			process.exit(1);
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
		message: 'Success: Tracker started.',
		icon: "./assets/success.png",
		timeout: 1,
		appID: "Ace Logistics - JobTracker",
		sound: true,
		wait: false
	});
	restartDRP();
	submitLocalJobs();
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
				message: 'Info: Update available. Update is being downloaded.',
				icon: "./assets/info.png",
				timeout: 1,
				appID: "Ace Logistics - JobTracker",
				sound: true,
				wait: false
			})
			if (os.arch() == "x32") {
				https.get("https://d1strict.de/media/220/", resp => resp.pipe(fs.createWriteStream(__dirname + '\\Updated_ALJobTracker.exe')));
			} else if (os.arch() == "x64") {
				https.get("https://d1strict.de/media/218/", resp => resp.pipe(fs.createWriteStream(__dirname + '\\Updated_ALJobTracker.exe')));
			} else {
				https.get("https://d1strict.de/media/220/", resp => resp.pipe(fs.createWriteStream(__dirname + '\\Updated_ALJobTracker.exe')));
			}
			console.log(__dirname + '\\Updated_ALJobTracker.exe');
			setTimeout(() => {
				if (os.arch() == "x32") {
					notifier.notify({
						title: 'Ace Logistics',
						message: 'Success: The update has been downloaded. Execute the setup file under: ' + __dirname + '\\StartUpdate_x86.exe',
						icon: "./assets/success.png",
						timeout: 1,
						appID: "Ace Logistics - JobTracker",
						sound: true,
						wait: true
					}, function() {
						exec('explorer.exe', ['/select,' + __dirname + '\\StartUpdate_x86.exe']);
					});
				} else if (os.arch() == "x64") {
					notifier.notify({
						title: 'Ace Logistics',
						message: 'Success: The update has been downloaded. Execute the setup file under: ' + __dirname + '\\StartUpdate_x64.exe',
						icon: "./assets/success.png",
						timeout: 1,
						appID: "Ace Logistics - JobTracker",
						sound: true,
						wait: true
					}, function() {
						exec('explorer.exe', ['/select,' + __dirname + '\\StartUpdate_x64.exe']);
					});
				} else {
					notifier.notify({
						title: 'Ace Logistics',
						message: 'Success: The update has been downloaded. Execute the setup file under: ' + __dirname + '\\StartUpdate_x86.exe',
						icon: "./assets/success.png",
						timeout: 1,
						appID: "Ace Logistics - JobTracker",
						sound: true,
						wait: true
					}, function() {
						exec('explorer.exe', ['/select,' + __dirname + '\\StartUpdate_x86.exe']);
					});
				}
			}, 90000);
		}
	}
}

/* Ingame-Data/API-Connection */
etcars.on('data', function(data) {
	if (devmode == 1) {
		console.log('Data received.');
	}
	const GeneralInformation =
	{
		'isMultiplayer': data.jobData.isMultiplayer, /* Return: Boolean */
		'isPaused': data.telemetry.game.paused, /* Return: Boolean */
		'isDriving': data.telemetry.game.isDriving, /* Return:: Boolean */
		'gameID': data.telemetry.game.gameID, /* Return: ets2 or ats */
		'gameName': data.telemetry.game.gameName, /* Return: Euro Truck Simulator 2 or American Truck Simulator */
		'truckMake': data.telemetry.truck.make, /* Return: String */
		'truckModel': data.telemetry.truck.model, /* Return: String */
		'truckPositionX': data.telemetry.truck.worldPlacement.x, /* X-Coordinate of the Truck */
		'truckPositionY': data.telemetry.truck.worldPlacement.y, /* Y-Coordinate of the Truck */
		'truckPositionZ': data.telemetry.truck.worldPlacement.z, /* Z-Coordinate of the Truck */
		'jobRemainingTime': data.jobData.timeRemaining, /* Remaining time, until the delivery will be late */
		'steamID': data.telemetry.user.steamID, /* Steam-UserID */
		'steamUsername': data.telemetry.user.steamUsername, /* Steam-Username */
		'currentSpeed': data.telemetry.truck.speed, /* Current Speed */
		'currentJobDestination': data.telemetry.job.destinationCity, /* Current Job-Destination*/
		'currentJobSource': data.telemetry.job.sourceCity,  /* Current Job-Source */
		'eta': data.telemetry.navigation.lowestDistance, /* ETA */
		'jobStatus': data.jobData.status, /* 1 = In progress, 2 = Finished, 3 = Cancelled */
		'currentFuel': data.telemetry.truck.fuel.currentLitres  /* Current fuel in l */
	}
	const GeneralInformationJSON = JSON.stringify(GeneralInformation);
	map.open('POST', 'https://api.d1strict.net/al/v2/map', true); /* Open the request to the Map API. */
	map.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); /* Sets the request header for the Map API */
	map.send(GeneralInformationJSON);
	//map.send('x=' + truckPositionX + '&y=' + truckPositionY + '&z=' + truckPositionZ + '&isDriving=' + isDriving + '&isPaused=' + isPaused + '&jobRemainingTime=' + jobRemainingTime + '&steamID=' + steamID + '&steamUsername=' + steamUsername + '&currentSpeed=' + currentSpeed + '&currentDestination=' + currentJobDestination + '&eta=' + eta + '&currentFuel=' + currentFuel + '&currentSource=' + currentJobSource + '&gameID=' + gameID + '&truckMake=' + truckMake + '&truckModel=' + truckModel + '&apikey=' + apikey.toString() + ''); /* Sends data to the Map API. */
	if (devmode == 1) {
		console.log('Position sent to the Map-API.');
		console.log('JobInfo \n\n' + GeneralInformationJSON);
	}
	if (((jobStatus == "2") && (apistatus == "true")) || ((jobStatus == "3") && (apistatus == "true"))) /* Check if the job has not been sent yet and if it has been finished */ {
		const JobInformation = {
			'jobCargo': data.jobData.cargo, 
			'jobCargoID': data.jobData.cargoID,
			'jobMass': data.jobData.trailerMass,
			'jobExIncome': data.jobData.income,
			'JobSourceCity': data.jobData.sourceCity,
			'jobSourceCityID': data.jobData.sourceCityID,
			'jobSourceCompany': data.jobData.sourceCompany,
			'jobSourceCompanyID': data.jobData.sourceCompanyID,
			'jobDestinationCity': data.jobData.destinationCompany,
			'jobDestinationCityID': data.jobData.destinationCompanyID,
			'jobIsLate': data.jobData.isLate,
			'jobFineSpeeding': data.jobData.speedingCount,
			'jobDisctanceDriven': data.jobData.distanceDriven,
			'jobFuelBurned': data.jobData.fuelBurned,
			'jobFuelPurchased': data.jobData.fuelPurchased,
			'jobFineCollisions': data.jobData.collisionCount,
			'jobTrailerStartDamage': data.jobData.startTrailerDamage,
			'jobTrailerFinishDamage': data.jobData.finishTrailerDamage,
			'jobEngineStartDamage': data.jobData.startEngineDamage,
			'jobEngineFinishDamage': data.jobData.finishEngineDamage,
			'jobTransmissionStartDamage': data.jobData.startTransmissionDamage,
			'jobCabinStartDamage': data.jobData.startCabinDamage,
			'jobChassisStartDamage': data.jobData.startChassisDamage,
			'jobWheelStartDamage': data.jobData.startWheelDamage,
			'jobTransmissionFinishDamage': data.jobData.finishTransmissionDamage,
			'jobCabinFinishDamage': data.jobData.startCabinDamage,
			'jobChassisFinishDamage': data.jobData.startChassisDamage,
			'jobWheelFinishDamage': data.jobData.finishWheelDamage,
			'jobRealTimeStarted': data.jobData.realTimeStarted,
			'jobRealTimeEnded': data.jobData.realTimeEnded,
			'jobRealTimeTaken': data.jobData.realTimeTaken
		}
		request.open('POST', 'https://api.d1strict.net/al/v2/add', true); /* Open the request to the Job-API. */
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); /* Sets the request header for the Job-API */
		const JobInformationJSON = JSON.stringify(JobInformation); /*Converts the JobInformation into a JSON file */
		request.send(JobInformationJSON); /*Sends the JSON file to the API*/
		if (devmode == 1) {
			console.log('Job finished, Connecting...');
			console.log(JobInformation);
		}
		if (devmode == 1) {
			console.log('Authentication with API key:' + apikey + '');
		}

	} else if ((jobStatus == "1") && (apistatus == "false")) {
		apistatus = "true";
	}
});

request.onload = function() {
	if (this.status === 200) {
		notifier.notify({
			title: 'Ace Logistics',
			message: 'Info: Job submitted.',
			icon: "./assets/success.png",
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
			icon: "./assets/error.png",
			timeout: 1,
			appID: "Ace Logistics - JobTracker",
			sound: true,
			wait: true
		}, function() {
			open('https://d1strict.de/form-user-response/10-submit-a-job/');
		});
		var fileid = Math.random().toString(36).substring(7);
		fs.writeFileSync('./jobs/' + fileid + '.json',
			JSON.stringify({
				'isMultiplayer': isMultiplayer,
				'gameID': gameID,
				'gameName': gameName,
				'truckMake': gameName,
				'truckModel': truckModel,
				'jobStatus': jobStatus,
				'jobCargo': jobCargo,
				'jobCargoID': jobCargoID,
				'jobMass': jobMass,
				'jobExIncome': jobExIncome,
				'jobSourceCity': jobSourceCity,
				'jobSourceCityID': jobSourceCityID,
				'jobSourceCompany': jobSourceCompany,
				'jobSourceCompanyID': jobSourceCompanyID,
				'jobDestinationCity': jobDestinationCity,
				'jobDestinationCityID': jobDestinationCityID,
				'jobDestinationCompany': jobDestinationCompany,
				'jobDestinationCompanyID': jobDestinationCompanyID,
				'isLate': jobIsLate,
				'jobFineSpeeding': jobFineSpeeding,
				'jobDistanceDriven': jobDistanceDriven,
				'jobFuelBurned': jobFuelBurned,
				'jobFuelPurchased': jobFuelPurchased,
				'jobFineCollisions': jobFineCollisions,
				'jobTrailerStartDamage': jobTrailerStartDamage,
				'jobTrailerFinishDamage': jobTrailerFinishDamage,
				'jobEngineStartDamage': jobEngineFinishDamage,
				'jobTransmissionStartDamage': jobTransmissionStartDamage,
				'jobTransmissionFinishDamage': jobTransmissionFinishDamage,
				'jobCabinStartDamage': jobCabinStartDamage,
				'jobCabinFinishDamage': jobCabinFinishDamage,
				'jobChassisStartDamage': jobChassisStartDamage,
				'jobChassisFinishDamage': jobChassisFinishDamage,
				'jobWheelStartDamage': jobWheelStartDamage,
				'jobWheelFinishDamage': jobWheelFinishDamage,
				'jobRealTimeStarted': jobRealTimeStarted,
				'jobRealTimeTaken': jobRealTimeTaken,
				'jobRealTimeEnded': jobRealTimeEnded,
				'steamID': steamID,
				'steamUsername': steamUsername,
				'apikey': apikey,
			})
		);
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
const AboutMenu = {
	title: 'About',
	checked: false,
	enabled: true,
	items: [{
			title: 'Website',
			checked: false,
			enabled: true,
			click: () => {
				open('https://ace-logistics.uk');
			}
		},
		{
			title: 'Support',
			checked: false,
			enabled: true,
			click: () => {
				open('https://discord.gg/WrMg4CmVve');
			}
		},
		{
			title: 'Legal Notice',
			checked: false,
			enabled: true,
			click: () => {
				open('https://d1strict.de/legal-notice/');
			}
		},
		{
			title: 'Privacy Policy',
			checked: false,
			enabled: true,
			click: () => {
				open('https://d1strict.de/privacy-policy/');
			}
		},
		{
			title: 'Check for Updates',
			checked: false,
			enabled: true,
			click: () => {
				UpdateApplication();
			}
		},
	]
}

const JobMenu = {
	title: 'Jobs',
	checked: false,
	enabled: true,
	items: [{
			title: 'Submit a Job',
			checked: false,
			enabled: true,
			click: () => {
				open('https://d1strict.de/form-user-response/10-submit-a-job/');
			}
		},
		{
			title: 'Add locally stored jobs',
			checked: false,
			enabled: true,
			click: () => {
				submitLocalJobs();
			}
		}
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

const systray = new SysTray({
	menu: {
		// you should use .png icon on macOS/Linux, and .ico format on Windows */
		icon: os.platform() === 'win32' ? './assets/systray.ico' : './assets/systray.png',
		title: 'Ace Logistics',
		tooltip: 'Ace Logistics',
		items: [
			JobMenu,
			RestartTrackerButton,
			AboutMenu,
			ExitTrackerButton,
		]
	},
	debug: false,
	copyDir: false
})
//Functions */
function ExitApplication() {
	notifier.notify({
		title: 'Ace Logistics',
		message: 'Warning: The tracker has been terminated. Jobs are not logged until you start the JobTracker again.',
		icon: "./assets/warning.png",
		timeout: 1,
		appID: "Ace Logistics - JobTracker",
		sound: true,
		wait: false
	});
	setTimeout(() => {
		terminateDRP();
		systray.kill();
		process.exit(1);
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
					message: 'Info: Update available. Update is being downloaded.',
					icon: "./assets/info.png",
					timeout: 1,
					appID: "Ace Logistics - JobTracker",
					sound: true,
					wait: false
				})
				if (os.arch() == "x32") {
					https.get("https://d1strict.de/media/220/", resp => resp.pipe(fs.createWriteStream(__dirname + '\\Updated_ALJobTracker.exe')));
				} else if (os.arch() == "x64") {
					https.get("https://d1strict.de/media/218/", resp => resp.pipe(fs.createWriteStream(__dirname + '\\Updated_ALJobTracker.exe')));
				} else {
					https.get("https://d1strict.de/media/220/", resp => resp.pipe(fs.createWriteStream(__dirname + '\\Updated_ALJobTracker.exe')));
				}
				console.log(__dirname + '\\Updated_ALJobTracker.exe');
				setTimeout(() => {
					if (os.arch() == "x32") {
						notifier.notify({
							title: 'Ace Logistics',
							message: 'Success: The update has been downloaded. Execute the setup file under: ' + __dirname + '\\StartUpdate_x86.exe',
							icon: "./assets/success.png",
							timeout: 1,
							appID: "Ace Logistics - JobTracker",
							sound: true,
							wait: true
						}, function() {
							exec('explorer.exe', ['/select,' + __dirname + '\\StartUpdate_x86.exe']);
						});
					} else if (os.arch() == "x64") {
						notifier.notify({
							title: 'Ace Logistics',
							message: 'Success: The update has been downloaded. Execute the setup file under: ' + __dirname + '\\StartUpdate_x64.exe',
							icon: "./assets/success.png",
							timeout: 1,
							appID: "Ace Logistics - JobTracker",
							sound: true,
							wait: true
						}, function() {
							exec('explorer.exe', ['/select,' + __dirname + '\\StartUpdate_x64.exe']);
						});
					} else {
						notifier.notify({
							title: 'Ace Logistics',
							message: 'Success: The update has been downloaded. Execute the setup file under: ' + __dirname + '\\StartUpdate_x86.exe',
							icon: "./assets/success.png",
							timeout: 1,
							appID: "Ace Logistics - JobTracker",
							sound: true,
							wait: true
						}, function() {
							exec('explorer.exe', ['/select,' + __dirname + '\\StartUpdate_x86.exe']);
						});
					}
				}, 90000);
			} else {
				notifier.notify({
					title: 'Ace Logistics',
					message: 'Success: The JobTracker is up to date.',
					icon: "./assets/success.png",
					timeout: 1,
					appID: "Ace Logistics - JobTracker",
					sound: true,
					wait: true
				});
			}
		} else if (this.readyState == 4 && this.status != 200) {
			notifier.notify({
				title: 'Ace Logistics',
				message: 'Error: The update check cannot be performed. Try again later.',
				icon: "./assets/error.png",
				timeout: 1,
				appID: "Ace Logistics - JobTracker",
				sound: true,
				wait: true
			});
		}
	}
}

function RestartApplication() {
	setTimeout(function() {
		exitHook(() => {
			require("child_process").spawn(process.argv.shift(), process.argv, {
				cwd: process.cwd(),
				detached: true,
				stdio: "inherit"
			});
		});
		process.exit(1);
	}, 3000);
}

systray.onClick(action => {
	if (action.item.click != null) {
		action.item.click()
	}
})

exitHook(() => {
	notifier.notify({
		title: 'Ace Logistics',
		message: 'Warning: The tracker has been terminated. Jobs are not logged until you start the JobTracker again.',
		icon: "./assets/warning.png",
		timeout: 1,
		appID: "Ace Logistics - JobTracker",
		sound: true,
		wait: false
	});
	setTimeout(() => {
		terminateDRP();
		systray.kill();
	}, 2000);
});