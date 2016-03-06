var path = require('path')
var fs = require('fs')
var logger = require('./logger')
var mac = /([0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2})/i
var yaml = require('js-yaml')

try {
  var doc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../data.yml'), 'utf8'));
  var macAddr = doc.Phone.MacAddress
  if (macAddr && !mac.test(macAddr)) {
    logger.error('mac 地址格式有误')
    process.exit(1)
  }
  module.exports = {
    shouldLookupDevice: !!macAddr,
    mobileMacAddr: macAddr,
    appLocation: doc.NeteaseMusicLocation,
    schedule: doc.Schedule,
    volume: doc.Volume,
    duration: doc.Schedule.Duration
  }
} catch (e) {
  logger.error('找不到配置文件，或者配置有误', e)
}