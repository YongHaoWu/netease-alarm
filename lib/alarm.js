var osascript = require('node-osascript')
var path = require('path')

var logger = require('./logger')
var openApp = require('./openApp')
var config = require('./config')

var ringCommand = 

module.exports = function(cb) {

  openApp(function(err) {
    if (err) return cb(err)

    // Set system volume
    if (config.volume)
      osascript.execute('set volume output volume ' + config.volume, function(error, result, raw) {
        if (err) return cb(err)
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

      cb()
    })
  })
}

function getRingCommand () {
  return "tell application \"System Events\" \n" + 
            "tell process \"NeteaseMusic\" to click menu item \"Play\" of menu 1 of menu bar item \"Controls\" of menu bar 1 \n" + 
          "end tell"
}