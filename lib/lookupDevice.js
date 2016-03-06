var config = require('./config')
var logger = require('./logger')

var arp = require('arp-table')()
var parse = require('arp-parse')()

function lookupDevice (cb) {
  if (!config.shouldLookupDevice) return cb()

  var isFound = false
  
  var stream = arp.stdout
    .pipe(parse)

  var macList = []
  stream.on('data', function(data) {
    if (data.mac) {
      macList.push(data)
    }
    if (data.mac && data.mac.toLowerCase() === config.mobileMacAddr.toLowerCase()) {
      logger.info('Found device - ip: %s - mac: %s', data.ip, data.mac)
      isFound = true
    }
  })

  stream.on('end', function() {
    if (!isFound) {
      logger.debug('mac list: ', macList)
      return cb('取消响铃，原因：没找到设备：' + config.mobileMacAddr)
    }
    cb()
  })
}

module.exports = lookupDevice