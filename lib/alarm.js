var osascript = require('node-osascript')
var path = require('path')

var logger = require('./logger')
var openApp = require('./openApp')
var config = require('./config')
var volume = require('./volume')

var ringCommand = 

module.exports = function(cb) {

  openApp(function(err) {
    if (err) return cb(err)

    var finishCount = 0, taskCount = 2

    // Set system volume
    if (config.volume)
      volume.fadeIn(config.volume, config.volume / 2, function (err) {
        if (err) return cb(err)
        if (taskCount == ++finishCount)
          return cb()
      })

    // Start alarm
    logger.info('Ready to ring the alarm...')
    osascript.execute(getRingCommand(), function(err, result, raw) {
      if (err) {
        if (/Can\’t get menu item \"Play\"/.test(err)) {
          logger.info('Music is already played...')
        } else {
          return cb(err)
        }
      }
      if (taskCount == ++finishCount)
        return cb()
    })
  })
}

function getRingCommand () {
  return "tell application \"System Events\" \n" + 
            "tell process \"NeteaseMusic\" to click menu item \"Play\" of menu 1 of menu bar item \"Controls\" of menu bar 1 \n" + 
          "end tell"
}