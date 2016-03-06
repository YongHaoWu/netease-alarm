var osascript = require('node-osascript')
var path = require('path')
var util = require('util')

var logger = require('./logger')
var config = require('./config')
var volume = require('./volume')
var i18n = require('./i18n')

module.exports = function(cb) {

  // Set system volume
  if (config.volume)
    volume.get(function (err, result) {
      if (err) return cb(err)
      volume.fadeOut(result, result / 3, function (err) {
        if (err) return cb(err)
        stopRing(function (err) {
          if (err) return cb(err)
          // Set back the volume
          volume.set(result, cb)
        })
      })
    })
  else
    stopRing(cb)
}

function stopRing (cb) {
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
    return cb()
  })
}

function getStopRingCommand () {
  var menubarNames = i18n.getNeteaseMusicMenubarNames()
  return util.format("tell application \"System Events\" \n" + 
            "tell process \"NeteaseMusic\" to click menu item \"%s\" of menu 1 of menu bar item \"%s\" of menu bar 1 \n" + 
          "end tell", menubarNames.pause, menubarNames.controls)
}
