/* 
    ===================================================================================================================
        JobTracker 2.0.0 - Fenix

        @Authors: AdyStudios, Felix Waßmuth (D1strict-Development)
        @License: MIT License - https://github.com/D1strict/AL-JobTracker/blob/2.0.0/LICENSE
        @Website: https://development.d1strict.de/
        (c) 2021, D1strict-Development
    ===================================================================================================================
*/

/* ===== Dependencies ===== */
const tst = require('trucksim-telemetry');
const notification = require('node-notifier');
const isOnline = require('is-online');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const fs = require('fs');
const home = require('os').homedir();
const http = require('http');
const reqpro = require('request-promise');
const path = require('path');
const SysTray = require('systray2').default;
const client = require('discord-rich-presence')('833293244741582868');
const {
	Webhook,
	MessageBuilder
} = require('discord-webhook-node');

/* ===== Settings ===== */
const appName = 'JobTracker';
const vtcName = 'Ace Logistics';
const appVersion = "2.0.0";
const vtcURL = 'https://ace-logistics.uk/';
const legalNotice = 'https://d1strict.de/legal-notice/';
const privacyPolicy = 'https://d1strict.de/privacy-policy/';
const supportURL = 'https://d1s.eu/alvtc/';
const jobSubmitURL = 'https://d1strict.de/form-user-response/10-submit-a-job/';
const apiURL = 'https://api.d1strict.net/ace-logistics/2-0-0/';
const apiKey = '';
const silentNotification = false;
const runtimePort = '07202';
const runtimePath = '/JobTracker';
const discordWebhook = new Webhook('https://discord.com/api/webhooks/858107565350060039/xRIgy0djDA5XGrlqYrawHRity1ShiFbb34iQyXPhYz9KuAtGQHTYDcKyOT0KvIYPB6ve');
const discordNotifier = true;
const discordAvatar = 'https://d1strict.de/media/202/';
const discordLink = 'https://ace-logistics.uk/';
const discordColor = '#102555';
const discordRichPresence = true;
const discordRichPresenceLargeImageKey = 'acelogistics';

/* ===== Language variables ===== */
langError = 'Error';
		langSuccess = 'Success';
		langWarning = 'Warning';
		langInfo = 'Info';
		langAppAlreadyRunning = 'The ' + appName + ' cannot be started, it is already running.';
		langAppJobOfflineSubmitSuccess = 'A local job was submitted.';
		langAppJobOfflineSubmitFailed = 'A local job could not be submitted.\nWe will try again the next time if you start ' + appName + '.';
		langAppConnected = 'The ' + appName + ' has been initialized.';
		langJobStartedOnline = 'Job started.\nHave a nice trip!';
		langJobStartedOffline = 'Job started.\nThis job is saved locally.\nHave a good trip!';
		langJobStartedOnline = 'Job cancelled.';
		langJobStartedOffline = 'Job cancelled.\nThis job is deleted locally.';
		langDiscordMessageJobStartedTitle = 'Job started';
		langDiscordRichPresenceBreakStatus = "I'm taking a break right now.";
		langDiscordRichPresenceBreak = "☕ Paused";
		langDiscordRichPresenceFreeroam = "🚛 Freeroam";
		langDiscordRichPresenceJob = "🚚 Job";
		

/* ===== Start-UP ===== */
const telemetry = tst();

reqpro({
	uri: `http://localhost:${runtimePort}${runtimePath}`,
	resolveWithFullResponse: true
}).then(res => {
	if (res.statusCode === 200) {
		notification.notify({
			title: appName,
			message: '' + langError + ':' + langAppAlreadyRunning + '',
			icon: './assets/error.png',
			appID: vtcName,
			sound: silentNotification
		});
		process.exit(1);
	} else {

		throw new Error(`statusCode ${res.statusCode}`);
	}
}).catch(_err => {
	const server = http.createServer((req, res) => {
		if (req.url === runtimePath) {
			res.statusCode = 200;
			res.end('ok');
		} else {
			res.statusCode = 404;
			res.end('err');
		}
	});
	server.listen(runtimePort);
	server.unref();
	try {
		var steamFile = home + '/Documents/' + vtcName + '/config.json';
		let file = JSON.parse(fs.readFileSync(steamFile, 'utf8'));
		steamID = file.steamID;
		steamUsername = file.steamUsername;

		/* ===== User-specific language variables ===== */
		langDiscordMessageJobStarted = '' + steamUsername + ' has started a job.';
		langDiscordMessageJobCancelledTitle = 'Job cancelled';
		langDiscordMessageJobCancelled = '' + steamUsername + ' has cancelled a job.';
		langDiscordMessageTookFerry = '' + steamUsername + ' took a ferry.';
		langDiscordMessageFined = '' + steamUsername + ' has received a fine';
		langDiscordMessageToll = '' + steamUsername + ' has passed a toll station.';
		langDiscordMessageTookTrain = '' + steamUsername + ' took a train.';
		langDiscordMessageCollision = '' + steamUsername + ' has damaged the vehicle.';
		langDiscordMessageCameOnline = '' + steamUsername + ' is now online.';
	} catch (err) {
		console.error(err);
	}
	discordWebhook.setUsername(vtcName);
	discordWebhook.setAvatar(discordAvatar);
	telemetry.watch();
	jobStatus = false;
});

async function DRP(data) {
	var steamFile = home + '/Documents/' + vtcName + '/config.json';
	var file = JSON.parse(fs.readFileSync(steamFile, 'utf8'));
	var speedUnit = file.speedUnit;
	if (data.game.game.name == "ets2") {
		var game = "ETS2";
	} else {
		var game = "ATS"
	}
	if (speedUnit == "kph") {
		var dctext = data.truck.brand.name + ' ' + data.truck.model.name+ ' | ' + JSON.stringify(data.truck.speed.kph) + 'kph';
	} else if (speedUnit == "mph") {
		var dctext = data.truck.brand.name + ' ' + data.truck.model.name+ ' | ' + JSON.stringify(data.truck.speed.mph) + 'mph';
	}
	if (typeof conTime === 'undefined') {
		conTime = Date.now();
	}
	if (((jobStatus === true) || (data.job.cargo.mass > "0")) && (data.game.paused != true)) {
		client.updatePresence({
			state: dctext,
			details: langDiscordRichPresenceJob + ': '+ data.job.source.city.name +' - '+ data.job.destination.city.name + ' (≈' + Math.round(data.job.cargo.mass / 1000) + 't)',
			largeImageKey: discordRichPresenceLargeImageKey,
			startTimestamp: conTime,
			instance: true,
			buttons: [
                { label: "Join "+ vtcName, url: vtcURL }
            ]
		  });
	} else if (data.game.paused === true) {
		client.updatePresence({
			state: langDiscordRichPresenceBreakStatus,
			details: langDiscordRichPresenceBreak+': '+ game +'',
			largeImageKey: discordRichPresenceLargeImageKey,
			largeImageText: appName + ' '+ appVersion,
			startTimestamp: conTime,
			instance: true,
			buttons: [
                { label: "🌈🐈🌟", url: "https://www.youtube.com/watch?v=GE8M5QM1sf8" }, /* Easteregg */
                { label: "Join "+ vtcName, url: vtcURL }
            ]
		  });
	} else {
	client.updatePresence({
		state: dctext,
		details: langDiscordRichPresenceFreeroam + ': '+ game +'',
		largeImageKey: discordRichPresenceLargeImageKey,
		startTimestamp: conTime,
		instance: true,
		buttons: [
			{ label: "Join "+ vtcName, url: vtcURL }
		]
	  });
	}
  }
  if (discordRichPresence) {
  telemetry.watch({interval: 5000}, DRP)
  }

  client.on('error', err => {
    console.log(`Error: ${err}`);
});

async function submitLocalJobs() {
		fs.readdir(home + '/Documents/' + vtcName + '/jobs/', (err, files) => {
			var deliveredJobs = files.filter(el => path.extname(el) === '.delivered');
			var startedJobs = files.filter(el => path.extname(el) === '.started');
			var cancelledJobs = files.filter(el => path.extname(el) === '.cancelled');
			startedJobs.forEach(file => {
				var jobFile = file;
				var jobID = jobFile.replace(".started", "");
				console.log(jobID);
				var request = new XMLHttpRequest();
				if (request) {
					request.onreadystatechange = function() {
						if ((request.readyState === 4) && (request.status === 200)) {
							fs.unlinkSync(home + '/Documents/' + vtcName + '/jobs/' + jobFile);
							console.log('Connection successful:\n HTTP-Status:' + request.status);
						} else if ((request.readyState === 4) && (request.status === 404)) {
							request.onreadystatechange = function() {
								if ((request.readyState === 4) && (request.status === 200)) {
									notification.notify({
										title: appName,
										message: '' + langSuccess + ':' + langAppJobOfflineSubmitSuccess + '',
										icon: './assets/success.png',
										appID: vtcName,
										sound: silentNotification,
										wait: true
									});
									fs.unlinkSync(home + '/Documents/' + vtcName + '/jobs/' + jobFile);
									if (devmode == 1) {
										console.log('Connection successful:\n HTTP-Status:' + request.status);
									}
								} else if ((request.readyState === 4) && (request.status !== 200)) {
									notification.notify({
										title: appName,
										message: '' + langError + ':' + langAppJobOfflineSubmitFailed + '',
										icon: './assets/error.png',
										appID: vtcName,
										sound: silentNotification,
										wait: true
									});
								}
							};
							request.open('POST', '' + apiURL + 'add?apikey=' + apiKey + '&steamID' + steamID + '&jobID=000000', true); /* Open the request to the Job-API. */
							request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); /* Sets the request header for the Job-API */
							request.send(JSON.stringify(JSON.parse(fs.readFileSync(jobFile, 'utf8')))); /* Sends the JSON file to the API */
						} else if ((request.readyState === 4) && ((request.status !== 404) || (request.status !== 200))) {
							notification.notify({
								title: appName,
								message: '' + langError + ':' + langAppJobOfflineSubmitFailed + '',
								icon: './assets/error.png',
								appID: vtcName,
								sound: silentNotification,
								wait: true
							});
						}
					};
					request.open('GET', '' + apiURL + 'job/get?apikey=' + apiKey + '&jobID=' + jobID + '', true); /* Open the request to the Job-API. */
					request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); /* Sets the request header for the Job-API */
					request.send(); /* Sends the JSON file to the API */
				}
			});
			deliveredJobs.forEach(file => {
				var jobFile = file;
				var jobID = jobFile.replace(".delivered", "");
				console.log(jobID);
				var request = new XMLHttpRequest();
				if (request) {
					request.onreadystatechange = function() {
						if ((request.readyState === 4) && (request.status === 200)) {
							fs.unlinkSync(home + '/Documents/' + vtcName + '/jobs/' + jobFile);
							console.log('Connection successful:\n HTTP-Status:' + request.status);
						} else if ((request.readyState === 4) && (request.status === 404)) {
							request.onreadystatechange = function() {
								if ((request.readyState === 4) && (request.status === 200)) {
									notification.notify({
										title: appName,
										message: '' + langSuccess + ':' + langAppJobOfflineSubmitSuccess + '',
										icon: './assets/success.png',
										appID: vtcName,
										sound: silentNotification,
										wait: true
									});
									fs.unlinkSync(home + '/Documents/' + vtcName + '/jobs/' + jobFile);
									if (devmode == 1) {
										console.log('Connection successful:\n HTTP-Status:' + request.status);
									}
								} else if ((request.readyState === 4) && (request.status !== 200)) {
									notification.notify({
										title: appName,
										message: '' + langError + ':' + langAppJobOfflineSubmitFailed + '',
										icon: './assets/error.png',
										appID: vtcName,
										sound: silentNotification,
										wait: true
									});
								}
							};
							request.open('POST', '' + apiURL + 'job/add?apikey=' + apiKey + '&steamID' + steamID + '&jobID=000000', true); /* Open the request to the Job-API. */
							request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); /* Sets the request header for the Job-API */
							request.send(JSON.stringify(JSON.parse(fs.readFileSync(jobFile, 'utf8')))); /* Sends the JSON file to the API */
						} else if ((request.readyState === 4) && ((request.status !== 404) || (request.status !== 200))) {
							notification.notify({
								title: appName,
								message: '' + langError + ':' + langAppJobOfflineSubmitFailed + '',
								icon: './assets/error.png',
								appID: vtcName,
								sound: silentNotification,
								wait: true
							});
						}
					};
					request.open('GET', '' + apiURL + 'job/get?apikey=' + apiKey + '&jobID=' + jobID + '', true); /* Open the request to the Job-API. */
					request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); /* Sets the request header for the Job-API */
					request.send(); /* Sends the JSON file to the API */
				}
			});
			cancelledJobs.forEach(file => {
				var jobFile = file;
				var jobID = jobFile.replace(".cancelled", "");
				console.log(jobID);
				var request = new XMLHttpRequest();
				if (request) {
					request.onreadystatechange = function() {
						if ((request.readyState === 4) && (request.status === 200)) {
							fs.unlinkSync(home + '/Documents/' + vtcName + '/jobs/' + jobFile);
							console.log('Connection successful:\n HTTP-Status:' + request.status);
						} else if ((request.readyState === 4) && (request.status === 404)) {
							request.onreadystatechange = function() {
								if ((request.readyState === 4) && (request.status === 200)) {
									notification.notify({
										title: appName,
										message: '' + langSuccess + ':' + langAppJobOfflineSubmitSuccess + '',
										icon: './assets/success.png',
										appID: vtcName,
										sound: silentNotification,
										wait: true
									});
									fs.unlinkSync(home + '/Documents/' + vtcName + '/jobs/' + jobFile);
									if (devmode == 1) {
										console.log('Connection successful:\n HTTP-Status:' + request.status);
									}
								} else if ((request.readyState === 4) && (request.status !== 200)) {
									notification.notify({
										title: appName,
										message: '' + langError + ':' + langAppJobOfflineSubmitFailed + '',
										icon: './assets/error.png',
										appID: vtcName,
										sound: silentNotification,
										wait: true
									});
								}
							};
							request.open('POST', '' + apiURL + 'add?apikey=' + apiKey + '&steamID' + steamID + '&jobID=000000', true); /* Open the request to the Job-API. */
							request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); /* Sets the request header for the Job-API */
							request.send(JSON.stringify(JSON.parse(fs.readFileSync(jobFile, 'utf8')))); /* Sends the JSON file to the API */
						} else if ((request.readyState === 4) && ((request.status !== 404) || (request.status !== 200))) {
							notification.notify({
								title: appName,
								message: '' + langError + ':' + langAppJobOfflineSubmitFailed + '',
								icon: './assets/error.png',
								appID: vtcName,
								sound: silentNotification,
								wait: true
							});
						}
					};
					request.open('GET', '' + apiURL + 'job/get?apikey=' + apiKey + '&jobID=' + jobID + '', true); /* Open the request to the Job-API. */
					request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); /* Sets the request header for the Job-API */
					request.send(); /* Sends the JSON file to the API */
				}
			});
		});
}

/* ===== Event-Listener ===== */
telemetry.game.on('connected', function() {
	notification.notify({
		title: appName,
		message: '' + langSuccess + ':' + langAppConnected + '',
		icon: './assets/success.png',
		appID: vtcName,
		sound: silentNotification
	});
	conTime = Date.now();
	/*if (discordNotifier) {
		discordWebhook.send(langDiscordMessageCameOnline);
	}*/
});

telemetry.job.on('started', async function(jobData) {
	jobStatus = true;
	var request = new XMLHttpRequest();
	await generateJobID();
	if ((await isOnline()) && (request)) {
		request.onreadystatechange = function() {
			if ((request.readyState === 4) && (request.status === 200)) {
				notification.notify({
					title: appName,
					message: '' + langInfo + ':' + langJobStartedOnline + '',
					icon: './assets/info.png',
					appID: vtcName,
					sound: silentNotification
				});
				if (devmode == 1) {
					console.log('Connection successful:\n HTTP-Status:' + request.status);
				}
			} else if ((request.readyState == 4) && (request.status !== 200)) {
				notification.notify({
					title: appName,
					message: '' + langInfo + ':' + langJobStartedOffline + '',
					icon: './assets/info.png',
					appID: vtcName,
					sound: silentNotification
				});
			}
		};
		request.open('POST', '' + apiURL + 'job/start?apikey=' + apiKey + '&steamID' + steamID + '&jobID=' + globalJobID + '', true); /* Open the request to the Job-API. */
		request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); /* Sets the request header for the Job-API */
		request.send(JSON.stringify(jobData)); /* Sends the JSON file to the API */
		if (discordNotifier) {
			const embed = new MessageBuilder()
				.setTitle(langDiscordMessageJobStartedTitle)
				.setAuthor(vtcName + ' - ' + appName, discordAvatar, discordLink)
				.setURL(discordLink)
				.addField(':detective: Steam-User', steamUsername)
				.addField(':triangular_flag_on_post: From', jobData.source.city + ' (' + jobData.source.company + ')')
				.addField(':checkered_flag: To', jobData.destination.city + ' (' + jobData.destination.company + ')')
				.addField(':beverage_box: Cargo', jobData.cargo.name)
				.addField(':man_lifting_weights: Mass', jobData.cargo.mass)
				.addField(':motorway: Expected Distance', jobData.plannedDistance.km + 'km (' + jobData.plannedDistance.miles + 'miles)')
				.addField(':construction_site: Special-Job', jobData.isSpecial)
				.setColor(discordColor)
				.setThumbnail(discordAvatar)
				.setDescription(langDiscordMessageJobStarted)
				.setFooter(appName, 'https://github.com/D1strict/AL-JobTracker/')
				.setTimestamp();
			discordWebhook.send(embed);
		}
	} else {
		if (typeof globalJobID === 'undefined') {
			await generateJobID();
		}
		notification.notify({
			title: appName,
			message: '' + langInfo + ':' + langJobStartedOffline + '',
			icon: './assets/info.png',
			appID: vtcName,
			sound: silentNotification
		});
	}
	fs.writeFileSync(home + '/Documents/' + vtcName + '/jobs/' + globalJobID + '.jtstarted', JSON.stringify(jobData));
});

telemetry.job.on('delivered', async function(jobData) {
	jobStatus = false;
	var request = new XMLHttpRequest();
	if (typeof globalJobID === 'undefined') {
		await generateJobID();
	}
	if ((await isOnline()) && (request)) {
		request.onreadystatechange = function() {
			if ((request.readyState === 4) && (request.status === 200)) {
				notification.notify({
					title: appName,
					message: '' + langInfo + ':' + langJobCancelledOnline + '',
					icon: './assets/info.png',
					appID: vtcName,
					sound: silentNotification
				});
				console.log('Connection successful:\n HTTP-Status:' + request.status);
			} else if ((request.readyState === 4) && (request.status !== 200)) {
				notification.notify({
					title: appName,
					message: '' + langInfo + ':' + langJobCancelledOffline + '',
					icon: './assets/info.png',
					appID: vtcName,
					sound: silentNotification
				});
			}
		};
		request.open('POST', '' + apiURL + 'job/deliver?apikey=' + apiKey + '&steamID' + steamID + '&jobID=' + globalJobID + '', true); /* Open the request to the Job-API. */
		request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); /* Sets the request header for the Job-API */
		request.send(JSON.stringify(jobData)); /* Sends the JSON file to the API */
		if (discordNotifier) {
			const embed = new MessageBuilder()
				.setTitle(langDiscordMessageJobCancelledTitle)
				.setAuthor(vtcName + ' - ' + appName, discordAvatar, discordLink)
				.setURL(discordLink)
				.addField(':detective: Steam-User', steamUsername)
				.addField(':triangular_flag_on_post: From', jobData.source.city + ' (' + jobData.source.company + ')')
				.addField(':checkered_flag: To', jobData.destination.city + ' (' + jobData.destination.company + ')')
				.addField(':beverage_box: Cargo', jobData.cargo.name)
				.addField(':man_lifting_weights: Mass', jobData.cargo.mass)
				.addField(':oncoming_police_car: Cargo-Damage', Math.round((jobData.cargo.damage) * 100) + '%')
				.addField(':construction_site: Special-Job', jobData.isSpecial)
				.setColor(discordColor)
				.setThumbnail(discordAvatar)
				.setDescription(langDiscordMessageJobFinished)
				.setFooter(appName, 'https://github.com/D1strict/AL-JobTracker/')
				.setTimestamp();
			discordWebhook.send(embed);
		}
	} else {
		notification.notify({
			title: appName,
			message: '' + langInfo + ':' + langJobFinishedOffline + '',
			icon: './assets/info.png',
			appID: vtcName,
			sound: silentNotification
		});
	}
	fs.writeFileSync(home + '/Documents/' + vtcName + '/jobs/' + globalJobID + '.jtdelivered', JSON.stringify(jobData));
	if (fs.existsSync(home + '/Documents/' + vtcName + '/jobs/' + globalJobID + '.jtstarted')) {
		fs.unlinkSync(home + '/Documents/' + vtcName + '/jobs/' + globalJobID + '.jtstarted');
	}
	if (fs.existsSync(home + '/Documents/' + vtcName + '/jobs/' + globalJobID + '.jtcancelled')) {
		fs.unlinkSync(home + '/Documents/' + vtcName + '/jobs/' + globalJobID + '.jtcancelled');
	}
});

telemetry.job.on('cancelled', async function(jobData) {
	jobStatus = false;
	var request = new XMLHttpRequest();
	if (typeof globalJobID === 'undefined') {
		await generateJobID();
	}
	if ((await isOnline()) && (request)) {
		request.onreadystatechange = function() {
			if ((request.readyState === 4) && (request.status === 200)) {
				notification.notify({
					title: appName,
					message: '' + langInfo + ':' + langJobCancelledOnline + '',
					icon: './assets/info.png',
					appID: vtcName,
					sound: silentNotification
				});
				if (devmode == 1) {
					console.log('Connection successful:\n HTTP-Status:' + request.status);
				}
			} else if ((request.readyState === 4) && (request.status !== 200)) {
				notification.notify({
					title: appName,
					message: '' + langInfo + ':' + langJobCancelledOffline + '',
					icon: './assets/info.png',
					appID: vtcName,
					sound: silentNotification
				});
			}
		};
		request.open('POST', '' + apiURL + 'job/cancel?apikey=' + apiKey + '&steamID' + steamID + '&jobID=' + globalJobID + '', true); /* Open the request to the Job-API. */
		request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); /* Sets the request header for the Job-API */
		request.send(JSON.stringify(jobData)); /* Sends the JSON file to the API */
		if (discordNotifier) {
			const embed = new MessageBuilder()
				.setTitle(langDiscordMessageJobCancelledTitle)
				.setAuthor(vtcName + ' - ' + appName, discordAvatar, discordLink)
				.setURL(discordLink)
				.addField(':detective: Steam-User', steamUsername)
				.addField(':triangular_flag_on_post: From', jobData.source.city + ' (' + jobData.source.company + ')')
				.addField(':checkered_flag: To', jobData.destination.city + ' (' + jobData.destination.company + ')')
				.addField(':beverage_box: Cargo', jobData.cargo.name)
				.addField(':man_lifting_weights: Mass', jobData.cargo.mass)
				.addField(':oncoming_police_car: Cargo-Damage', Math.round((jobData.cargo.damage) * 100) + '%')
				.addField(':construction_site: Special-Job', jobData.isSpecial)
				.setColor(discordColor)
				.setThumbnail(discordAvatar)
				.setDescription(langDiscordMessageJobCancelled)
				.setFooter(appName, 'https://github.com/D1strict/AL-JobTracker/')
				.setTimestamp();
			discordWebhook.send(embed);
		}
	} else {
		notification.notify({
			title: appName,
			message: '' + langInfo + ':' + langJobCancelledOffline + '',
			icon: './assets/info.png',
			appID: vtcName,
			sound: silentNotification
		});
	}
	fs.writeFileSync(home + '/Documents/' + vtcName + '/jobs/' + globalJobID + '.jtcancelled', JSON.stringify(jobData));
	if (fs.existsSync(home + '/Documents/' + vtcName + '/jobs/' + globalJobID + '.jtstarted')) {
		fs.unlinkSync(home + '/Documents/' + vtcName + '/jobs/' + globalJobID + '.jtstarted');
	}
	if (fs.existsSync(home + '/Documents/' + vtcName + '/jobs/' + globalJobID + '.jtcancelled')) {
		fs.unlinkSync(home + '/Documents/' + vtcName + '/jobs/' + globalJobID + '.jtcancelled');
	}
});

telemetry.game.on('ferry', function(ferryData) {
	if (discordNotifier) {
		var source = ferryData.source.name;
		var destination = ferryData.destination.name;
		discordWebhook.send(langDiscordMessageTookFerry + ' (' + source + ' to ' + destination + ')');
	}
});

telemetry.game.on('fine', function(fineData) {
	if (discordNotifier) {
		var offense = fineData.offense;
		discordWebhook.send(langDiscordMessageFined + ' (' + offense + ')');
	}
});

telemetry.game.on('tollgate', function(tollData) {
	if (discordNotifier) {
		discordWebhook.send(langDiscordMessageToll);
	}
});

telemetry.game.on('train', function(trainData) {
	if (discordNotifier) {
		var source = trainData.source;
		var destination = trainData.destination;
		discordWebhook.send(langDiscordMessageTookTrain + ' (' + source + ' to ' + destination + ')');
	}
});

telemetry.truck.on('damage', function(currentDamage, previousDamage) {
	if (discordNotifier) {
		var damage = Math.round((((currentDamage.total) * 100) - (previousDamage.total)));
		discordWebhook.send(langDiscordMessageCollision + ' (' + damage + '%)');
	}
});

async function generateJobID() {
	var jobID = Math.random().toString(36).substring(7);
	if ((fs.existsSync(home + '/Documents/' + vtcName + '/jobs/' + jobID + '.jtstarted')) || (fs.existsSync(home + '/Documents/' + vtcName + '/jobs/' + jobID + '.jtdelivered')) || (fs.existsSync(home + '/Documents/' + vtcName + '/jobs/' + jobID + '.jtcancelled'))) {
		jobID();
	} else {
		var request = new XMLHttpRequest();
		if ((await isOnline()) && (request)) {
			request.onreadystatechange = function() {
				if ((request.readyState == 4) && (request.status == 200) && (request.responseText !== 'success')) {
					jobID = globalJobID;
					return;
				} else if ((request.readyState == 4)((request.status !== 200) || (request.responseText !== 'success'))) {
					jobID();
					console.log('Job ID could not be registered.');
				}
			};
		}
		request.open('POST', '' + apiURL + 'registerJID?apikey=' + apiKey + '&steamID' + steamID + '', true); /* Open the request to the Job-API. */
		request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); /* Sets the request header for the Job-API */
		request.send(jobID); /* Sends the JSON file to the API */
	}
}

const AboutMenu = {
	title: 'About',
	checked: false,
	enabled: true,
	items: [{
			title: 'Website',
			checked: false,
			enabled: true,
			click: () => {
				open(vtcURL);
			}
		},
		{
			title: 'Support',
			checked: false,
			enabled: true,
			click: () => {
				open(supportURL);
			}
		},
		{
			title: 'Legal Notice',
			checked: false,
			enabled: true,
			click: () => {
				open(legalNotice);
			}
		},
		{
			title: 'Privacy Policy',
			checked: false,
			enabled: true,
			click: () => {
				open(privacyPolicy);
			}
		},
		{
			title: 'Check for Updates',
			checked: false,
			enabled: true,
			click: () => {
				updateCheck();
			}
		},
	]
};

const JobMenu = {
	title: 'Jobs',
	checked: false,
	enabled: true,
	items: [{
			title: 'Submit a Job',
			checked: false,
			enabled: true,
			click: () => {
				open(jobSubmitURL);
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
};

const RestartTrackerButton = {
	title: 'Restart',
	checked: false,
	enabled: true,
	click: () => {
		RestartApplication();
	}
};


const ExitTrackerButton = {
	title: 'Exit',
	checked: false,
	enabled: true,
	click: () => {
		ExitApplication();
	}
};

const systray = new SysTray({
	menu: {
		icon: './assets/systray.ico',
		title: appName,
		tooltip: vtcName,
		items: [
			JobMenu,
			RestartTrackerButton,
			AboutMenu,
			ExitTrackerButton,
		]
	},
	debug: false,
	copyDir: true
});
//Functions */
function ExitApplication() {
	notification.notify({
		title: appName,
		message: 'Warning: The tracker has been terminated. Jobs are not logged until you start the' + APPName + ' again.',
		icon: "./assets/warning.png",
		timeout: 1,
		appID: vtcName,
		sound: true,
		id: 107,
		wait: false
	});
	setTimeout(() => {
		systray.kill();
		process.exit(1);
	}, 1000);
}

function RestartApplication() {
	setTimeout(function() {
		systray.kill();
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
		action.item.click();
	}
});