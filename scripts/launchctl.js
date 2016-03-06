var path = require('path')
var config = require('../lib/config')
var launchd = require('./launchd')

installPlist('org.edwardchu.netease-alarm')

if (config.schedule.Duration > 0)
  installPlist('org.edwardchu.netease-alarm-stop')

function installPlist (plistId) {
  // Unload and remove plist
  launchd.remove(plistId, function (err) {
    // if (err) console.error('can\'t unload plist, but still preceed', err)

    // Install and load plist
    launchd.install(path.join(__dirname, '../build/' + plistId + '.plist'), function (err, stdout, stderr) {
      if (err) return console.error('can\'t install plist', err)
      showOutput(stdout, stderr)
    })
  })
}

function showOutput (stdout, stderr) {
  if (stdout)
    console.log(stdout)
  if (stderr)
    console.error(stderr)
}