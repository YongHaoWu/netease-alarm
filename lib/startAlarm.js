var osascript = require('node-osascript')
var path = require('path')
var util = require('util')

var logger = require('./logger')
var openApp = require('./openApp')
var config = require('./config')
var volume = require('./volume')
var i18n = require('./i18n')

module.exports = function(cb) {

  openApp(function(err) {
    if (err) return cb(err)

    var finishCount = 0, taskCount = 2

    // Set system volume
    if (config.volume)
      volume.fadeIn(config.volume, config.volume / 3, function (err) {
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
  var menubarNames = i18n.getNeteaseMusicMenubarNames()
  return util.format("tell application \"System Events\" \n" + 
            "tell process \"NeteaseMusic\" to click menu item \"%s\" of menu 1 of menu bar item \"%s\" of menu bar 1 \n" + 
          "end tell", menubarNames.play, menubarNames.controls)
}
