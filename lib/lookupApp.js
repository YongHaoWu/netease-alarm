var ps = require('ps-node')

var MAX_RETRY_COUNT = 1,
    DELAY_TIME      = 1000

var FOUND = true
var NOT_FOUND = false

function lookupApp (appName, cb, retryCount) {
  retryCount = retryCount || 0

  ps.lookup({
      command: appName,
      psargs: 'aux',
    }, function(err, resultList) {
      if (err) return cb(err)

      if (resultList.length > 0)
        return cb(null, FOUND)

      if (retryCount >= MAX_RETRY_COUNT)
        return cb(null, NOT_FOUND)

      console.log('Retry lookup..')

      setTimeout(function() {
        lookupApp(appName, cb, ++retryCount)
      }, DELAY_TIME)
  });
}

module.exports = lookupApp