/* 	Ace Logistics - JobTracker 1.1.0

    @Authors: AdyStudios, Felix Waßmuth (D1strict-Development)
    @License: GNU General Public License v3.0 - https://github.com/D1strict/AL-JobTracker/blob/main/LICENSE
    @Website: https://ace-logistics.uk/
    (c) 2021, Ace Logistics

*/

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
const isOnline = require('is-online');
const isReachable = require('is-reachable');

/* Configuration */
etcars.enableDebug = false; /* to enable debug console.log and console.error */
var devmode = 0; /* Developer mode: 1 - Active - Advanced outputs in the console, 0 = Production mode (no outputs in the console). */
var version = 2; /* Versionnumber (not Semantic) */
const AlTPort = 10853; /* Port for the process check (should be a port which is not commonly) */
const AlTPath = '/AlT'; /* Random path. Should not contain special characters or umlauts. */
var apikey = ""; /* INSERT API-KEY */

/* StartUp */
onlineCheck();
updateCheck();
submitLocalJobs();
restartDRP();

/* Functions */

async function onlineCheck() {
	isOnlineCheck = await isOnline();
	isReachableCheck = await isReachable('api.d1strict.net/al/1-1-0/appversion.txt');
	return;
}

/* Checking for - and installing updates */
async function updateCheck(notification) {
	await onlineCheck();;
	if ((isOnlineCheck == true) && (isReachableCheck == true)) {
		updateserver.open("GET", "https://api.d1strict.net/al/1-1-0/appversion.txt");
		updateserver.send();
		updateserver.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				if (updateserver.responseText > version) {
					if (os.arch() == "x32") {
						url = "https://d1strict.de/media/218/";
						dest = os.tmpdir() + '\\Updated_ALJobTracker.exe';
					} else if (os.arch() == "x64") {
						url = "https://d1strict.de/media/220/";
						dest = os.tmpdir() + '\\Updated_ALJobTracker.exe';
					} else {
						url = "https://d1strict.de/media/220/";
						dest = os.tmpdir() + '\\Updated_ALJobTracker.exe';
					}
					downloadUpdate(url, dest);
					if (notification == "corrupt") {
						notifier.notify({
							title: 'Ace Logistics',
							message: 'Info: Update is being downloaded.',
							icon: "./assets/info.png",
							timeout: 1,
							appID: "Ace Logistics - JobTracker",
							sound: true,
							id: 100,
							wait: false
						})
					} else if (notification == "notification") {
						notifier.notify({
							title: 'Ace Logistics',
							message: 'Info: Update available. Update is being downloaded.',
							icon: "./assets/info.png",
							timeout: 1,
							appID: "Ace Logistics - JobTracker",
							sound: true,
							id: 100,
							wait: true
						})
					}
				} else {
					if (notification == "notification") {
						notifier.notify({
							title: 'Ace Logistics',
							message: 'Info: The JobTracker is up to date.',
							icon: "./assets/info.png",
							timeout: 1,
							appID: "Ace Logistics - JobTracker",
							sound: true,
							id: 100,
							wait: true
						})
					}
				}
			}
		}
	}
}

async function downloadUpdate(url, dest, cb) {
	await onlineCheck();;
	if ((isOnlineCheck == true) && (isReachableCheck == true)) {
		var file = fs.createWriteStream(dest);
		var request = https.get(url, function(response) {
			response.pipe(file);
			file.on('finish', function() {
				file.close(cb); // close() is async, call cb after close completes.
				notifier.notify({
					title: 'Ace Logistics',
					message: 'Success: The update has been downloaded successfully. The installation routine will be started in a few moments.',
					icon: "./assets/success.png",
					timeout: 1,
					appID: "Ace Logistics - JobTracker",
					sound: true,
					id: 101,
					wait: false
				});
				exec(os.tmpdir() + '\\Updated_ALJobTracker.exe', function(err, data) {
					if (devmode == 1) {
						if (err) {
							console.log(err);
							return;
						}
						console.log(data.toString());
					}
				})
				setTimeout(() => {
					terminateDRP();
					systray.kill();
				}, 5000);
			});
		}).on('error', function(err) { // Handle errors
			fs.unlink(dest); // Delete the file async. (But we don't check the result)
			if (cb && devmode == 1) cb(err.message);
			notifier.notify({
				title: 'Ace Logistics',
				message: 'Error: An error has occurred. The update could not be downloaded. Try again later.',
				icon: "./assets/error.png",
				timeout: 1,
				appID: "Ace Logistics - JobTracker",
				sound: true,
				id: 102,
				wait: true
			});
		});

	}
}

/* Submit of local-saved Jobs */
var submitJobsRunnning = false;
async function submitLocalJobs() {
	if (!submitJobsRunnning) {
		await onlineCheck();
		if ((isOnlineCheck == true) && (isReachableCheck == true)) {
			fs.readdir("./jobs/", (err, files) => {
				if (err) throw err;
				files.forEach(file => {
					var jsondata = fs.readFileSync("./jobs/" + file + "", 'utf8');
					if (files.length == 0) {
						fs.unlink('./jobs/' + file + '', (err) => {
							if (err && devmode == 1) {
								console.log(err)
								return
							}
						})
					} else {
						setTimeout(() => {
							var content = JSON.parse(jsondata);
							console.log(content);
							localjobsender.open('POST', 'https://api.d1strict.net/al/1-1-0/add?apikey=' + apikey + '&dcnotification=no', true); /* Open the request to the Job-API. */
							localjobsender.setRequestHeader('Content-Type', 'application/json'); /* Sets the request header for the Job-API */
							localjobsender.send(JSON.stringify(content)); /*Sends the JSON file to the API*/
							if (devmode == 1) {
								console.log('Job finished, Connecting...');
							}
							filedeletion = './jobs/' + file + '';
						}, 65000);
					}
				});
			})
		} else {
			notifier.notify({
				title: 'Ace Logistics',
				message: 'Error: Local jobs could not be submitted.\nCheck your internet connection.',
				icon: "./assets/error.png",
				timeout: 1,
				appID: "Ace Logistics - JobTracker",
				sound: true,
				id: 103,
				wait: false
			});
		}
	} else {
		notifier.notify({
			title: 'Ace Logistics',
			message: 'Warning: Local jobs are already submitted. Be patient for a moment.',
			icon: "./assets/warning.png",
			timeout: 1,
			appID: "Ace Logistics - JobTracker",
			sound: true,
			id: 103,
			wait: false
		});
	}
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
			id: 103,
			wait: false
		});
		fs.writeFile(filedeletion, "", (err) => {
			if (err) throw err;
			if (devmode == 1) {
				console.log("API connection successful:");
				console.log(this.responseText);
				console.log("Local job is emptied and flagged for deletion.")
			}
		})
	} else if (this.readyState == 4 && this.status != 200) {
		notifier.notify({
			title: 'Ace Logistics',
			message: 'Error: Local jobs could not be submitted.',
			icon: "./assets/error.png",
			timeout: 1,
			appID: "Ace Logistics - JobTracker",
			sound: true,
			id: 103,
			wait: false
		});
	}
};

/* Restart of the Discord-Rich Presence */
function restartDRP() {
	if (devmode == 1) {
		console.log("Restart DRP...");
	}
	if (os.arch() == "x32") {
		exec(__dirname + '\\RebootDRP_x86.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err)
					return;
				}
				console.log(data.toString());
			}
		});
	} else if (os.arch() == "x64") {
		exec(__dirname + '\\RebootDRP_x64.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err)
					return;
				}
				console.log(data.toString());
			}
		});
	} else {
		exec(__dirname + '\\RebootDRP_x86.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err)
					return;
				}
				console.log(data.toString());
			}
		});
	}
}

/* Termination of the Discord-Rich Presence */
function terminateDRP() {
	if (devmode == 1) {
		console.log("Terminate DRP...");
	}
	if (os.arch() == "x32") {
		exec(__dirname + '\\TerminateDRP_x86.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err)
					return;
				}
				console.log(data.toString());
			}
		});
	} else if (os.arch() == "x64") {
		exec(__dirname + '\\TerminateDRP_x64.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err)
					return;
				}
				console.log(data.toString());
			}
		});
	} else {
		exec(__dirname + '\\TerminateDRP_x86.exe', function(err, data) {
			if (devmode == 1) {
				if (err) {
					console.log(err)
					return;
				}
				console.log(data.toString());
			}
		});
	}
}

/* Removal of existing notifications */
var notifyIDS = ["100", "101", "102", "103", "104", "105", "106", "107"];
notifyIDS.forEach(notifyRemove);
function notifyRemove(item) {
	notifier.notify({
		'remove': item, // to remove all group ID
	});
}

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
			id: 105,
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
		message: 'JobTracker started.',
		icon: "./assets/logo.png",
		timeout: 1,
		appID: "Ace Logistics - JobTracker",
		sound: true,
		id: 105,
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

/* Data-Logging & Transmission */
etcars.on('data', function(data) {
	if (devmode == 1) {
		console.log('Data received.');
	}
	jobStatus = data.jobData.status; /* 1 = In progress, 2 = Finished, 3 = Cancelled */
	APISaving(data);
	MapTransmitting(data);
});

async function MapTransmitting(data) {
	await onlineCheck();
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
	var currentFuel = data.telemetry.truck.fuel.currentLitres; /* Current fuel in l */
	map.open('POST', 'https://api.d1strict.net/al/1-1-0/map', true); /* Open the request to the Map API. */
	map.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); /* Sets the request header for the Map API */
	map.send('game=' + gameName + '&x=' + truckPositionX + '&y=' + truckPositionY + '&z=' + truckPositionZ + '&isDriving=' + isDriving + '&isPaused=' + isPaused + '&jobRemainingTime=' + jobRemainingTime + '&steamID=' + steamID + '&steamUsername=' + steamUsername + '&currentSpeed=' + currentSpeed + '&currentDestination=' + currentJobDestination + '&eta=' + eta + '&currentFuel=' + currentFuel + '&currentSource=' + currentJobSource + '&gameID=' + gameID + '&truckMake=' + truckMake + '&truckModel=' + truckModel + '&apikey=' + apikey + ''); /* Sends data to the Map API. */
	if (devmode == 1) {
		console.log('Position sent to the Map-API.');
	}
}

async function APISaving(data) {
	await onlineCheck();
	if (((jobStatus == "2") && (apistatus == "true")) || ((jobStatus == "3") && (apistatus == "true"))) /* Check if the job has not been sent yet and if it has been finished */ {
		;
		if ((isOnlineCheck == true) && (isReachableCheck == true)) {
			request.open('POST', 'https://api.d1strict.net/al/1-1-0/add?apikey=' + apikey + '', true); /* Open the request to the Job-API. */
			request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); /* Sets the request header for the Job-API */
			request.send(JSON.stringify(data)); /*Sends the JSON file to the API*/
			if (devmode == 1) {
				console.log('Job finished, Connecting...');
				console.log('JobInfo \n\n' + data);
			}
			if (devmode == 1) {
				console.log('Authentication with API key:' + apikey + '');
			}
		} else {
			var fileid = Math.random().toString(36).substring(7);
			fs.writeFileSync('./jobs/' + fileid + '.json', JSON.stringify(data));
			retryCount = 0;
			apistatus = "false";
		}
	} else if ((jobStatus == "1") && (apistatus == "false")) {
		apistatus = "true";
	}
};

request.onload = function() {
	if (this.readyState == 4 && this.status === 200) {
		notifier.notify({
			title: 'Ace Logistics',
			message: 'Info: Job submitted.',
			icon: "./assets/success.png",
			timeout: 1,
			appID: "Ace Logistics - JobTracker",
			sound: true,
			id: 106,
			wait: false
		});
		if (devmode == 1) {
			console.log("API connection successful:");
			console.log(this.responseText);
		}
		apistatus = "false";
	} else if (this.readyState == 4 && this.status == 200) {
		var fileid = Math.random().toString(36).substring(7);
		fs.writeFileSync('./jobs/' + fileid + '.json', data);
		apistatus = "false";
		notifier.notify({
			title: 'Ace Logistics',
			message: 'Info: Job locally saved.',
			icon: "./assets/info.png",
			timeout: 1,
			appID: "Ace Logistics - JobTracker",
			sound: true,
			id: 106,
			wait: false
		});
	}
}
etcars.on('connect', function(data) {
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
				updateCheck("notification");
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
			title: 'Submit locally stored jobs',
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
		id: 107,
		wait: false
	});
	setTimeout(() => {
		terminateDRP();
		systray.kill();
		process.exit(1);
	}, 1000);
}

function RestartApplication() {
	restartDRP();
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
		id: 107,
		wait: false
	});
	setTimeout(() => {
		terminateDRP();
		systray.kill();
	}, 2000);
});