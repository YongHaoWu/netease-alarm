var open = require('open')

var lookupApp = require('./lookupApp')
var logger = require('./logger')
var config = require('./config')

module.exports = function(cb) {
  
  // Check if App first is opened
  lookupApp('NeteaseMusic', function(err, isFound) {

    if (err)
      return cb('Could not lookup running process.')

    if (isFound)
      return cb(null, config.appLocation)

    // Open up App
    open(config.appLocation)

    // Check again afterwards
    setTimeout(function () {
      lookupApp('NeteaseMusic', function(err, isFound) {
        if (err)
          return cb('Could not lookup running process.')

        if (isFound)
          return cb(null, config.appLocation)

        return cb('打不开音乐播放器，请检查该路径是否正确：' + config.appLocation)

      })
    }, 1000)
  })
}

