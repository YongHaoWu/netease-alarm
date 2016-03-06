var fs = require('fs')
var path = require('path')
var Plist = require('launchd.plist')

var config = require('../lib/config')
var i18n = require('../lib/i18n')
var isDebug = process.env.NODE_ENV === 'debug'
var scheduleData = config.schedule

//
// Configurations
// 
var PLIST_PLAY_CONFIG = {
  id: 'org.edwardchu.netease-alarm',
  program: path.join(__dirname, '../index.js'),
  schedule: function () {
    if (isDebug) {
      scheduleData.Hour = new Date().getHours()
      scheduleData.Minute = new Date().getMinutes() + 1
      scheduleData.Duration = 1
      scheduleData.OnlyWeekday = false
    }

    i18n.schedule(scheduleData, isDebug)
    return scheduleData
  }
}

var PLIST_STOP_CONFIG = {
  id: 'org.edwardchu.netease-alarm-stop',
  program: path.join(__dirname, 'stopAlarm.js'),
  schedule: function () {
    var moment = require('moment')
    var date = moment().hour(scheduleData.Hour)
                        .minute(scheduleData.Minute)
                        .second(0).
                        add(scheduleData.Duration, 'minutes')
    
    scheduleData.Hour = date.hour()
    scheduleData.Minute = date.minute()

    return scheduleData
  }
}

//
// Build files
// 
build(PLIST_PLAY_CONFIG)

if (config.schedule.Duration > 0)
  build(PLIST_STOP_CONFIG)

//
// Helper functions
//

function build (config) {
  var plist = new Plist()
  plist.addString('Label', config.id)
  plist.addArray('ProgramArguments', [process.execPath, config.program])
  plist.setStdOutPath(path.join(__dirname, '../logs/launchd_out.log'))
  plist.setStdErrPath(path.join(__dirname, '../logs/launchd_err.log'))
  plist.setTimeOut(10)
  plist.setExitTimeOut(10)
  plist.setLaunchOnlyOnce(isDebug)

  addCalendarInterval(plist, config.schedule())

  var contents = plist.build()
  var buildDir = path.join(__dirname, '../build')
  var buildFile = path.join(buildDir, config.id + '.plist')

  if (!fs.existsSync(buildDir))
    fs.mkdirSync(buildDir)

  fs.writeFile(buildFile, contents, function(err) {
    if (err) throw err
  })
}

function addCalendarInterval (plist, schedule) {

  if (schedule.OnlyWeekday) {
    for(var i = 1; i <= 5; i++) {
      _fn(i)
    }
  } else {
    _fn()
  }

  function _fn (weekday) {
    var calendarData = {
      Hour: schedule.Hour,
      Minute: schedule.Minute
    }
    if (weekday)
      calendarData.Weekday = weekday

    plist.addCalendarInterval(calendarData)
  }
}
