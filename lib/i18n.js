var util = require('util')
var osLocale = require('os-locale')


function schedule (data, isDebug) {
  var msg = util.format("闹钟将会在 %s:%d 响起", data.Hour, data.Minute)

  if (data.Duration > 0)
    msg += util.format(isDebug ? "\n测试模式下 %d 分钟后自动停止" : "，%d 分钟后自动停止", data.Duration)
  else
    msg += "，需手动停止"

  if (isDebug)
    msg += "，并且仅播放一次"
  else
    msg += "\n播放频率：" + (data.OnlyWeekday ? "仅工作日" : "每天")

  console.log(msg)
}

function getNeteaseMusicMenubarNames () {
  var locale = osLocale.sync()

  if (locale === 'zh_CN') {
    return {
      pause: '暂停',
      play: '播放',
      controls: '控制'
    }
  }
  return {
    pause: 'Pause',
    play: 'Play',
    controls: 'Controls'
  }
}


module.exports = {
  schedule: schedule,
  getNeteaseMusicMenubarNames: getNeteaseMusicMenubarNames
}
