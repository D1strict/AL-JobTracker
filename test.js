const SysTray = require('systray2').default;
const os = require('os').default;
var open = require('open');
console.log('Started');


const AceLogistcsMenu = 
{
  title: 'Ace Logistics',
  tooltip: 'Useful links',
  checked: false,
  enabled: true,
    items: 
    [{
        title: 'Home Page',
        tooltip: 'Takes you to the homepage',
        checked: false,
        enabled: true
    }, 
    {
        title: 'Submit a Job',
        tooltip: "Your job wasn't logged? Here you can sumbit it manually.",
        checked: false,
        enabled: true
    },
    {
        title: 'Help',
        tooltip: "Need some help? Join our discord server and open a support ticket!",
        checked: false,
        enabled: true
    },
    ]
}

const RestartTrackerButton = 
{
    title: 'Restart',
    tooltip: 'Restarts the tracker if there is any problem...',
    checked: false,
    enabled: true,
    click: () => {
    RestartApplication();
  }
}

const ExitTrackerButton = 
{
    title: 'Exit',
    tooltip: "Stops the tracker. Your jobs won't be loged until you start the tracker again",
    checked: false,
    enabled: true,
    click: () => {
    ExitApplication();
  }
}

const systray = new SysTray({
  menu: {
    // you should use .png icon on macOS/Linux, and .ico format on Windows
    icon: "PLACE HOLDER",
    title: 'Ace Logistics',
    tooltip: 'Greetings for the development team',
    items: 
    [
      AceLogistcsMenu,
      RestartTrackerButton,
      ExitTrackerButton
    ]
  },
  debug: false,
  copyDir: false // copy go tray binary to outside directory, useful for packing tool like pkg.
})


function ExitApplication(){
    process.exit();
    systray.kill();
}
function RestartApplication(){
    setTimeout(function () {
        process.on("exit", function () {
            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached : true,
                stdio: "inherit"
            });
    });
    process.exit();
}, 5000);
}

systray.onClick(action => {
  if (action.item.click != null) {
    action.item.click()
  }
})

systray.onClick(action => {
    if (action.seq_id === 0) { //Ace Logistics Homepage Button
       open('https://ace-logistics.uk');
    } 
    else if (action.seq_id === 1) { //sumbit a job button
        open('https://d1strict.de/form-user-response/10-submit-a-job/');
    } 
    else if (action.seq_id === 2) { //Help button
        open('https://discord.gg/WrMg4CmVve');
    }
})