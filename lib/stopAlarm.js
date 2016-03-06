var osascript = require('node-osascript')
var path = require('path')

var logger = require('./logger')
var config = require('./config')

module.exports = function(cb) {

  // Stop alarm
  logger.info('Ready to stop the alarm...')
  osascript.execute(getStopRingCommand(), function(err, result, raw) {
    if (err) {
      if (/Can\’t get menu item \"Pause\"/.test(err)) {
        logger.info('Music is already stoped...')
      } else {
        return cb(err)
      }
    }

    cb()
  })
}

function getStopRingCommand () {
  return "tell application \"System Events\" \n" + 
            "tell process \"NeteaseMusic\" to click menu item \"Pause\" of menu 1 of menu bar item \"Controls\" of menu bar 1 \n" + 
          "end tell"
}