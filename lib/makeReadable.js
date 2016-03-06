var util = require('util')

function schedule (data, isDebug) {
  var msg = util.format("闹钟将会在 %d 点 %d 分响起", data.Hour, data.Minute)

  if (data.Duration > 0)
    msg += util.format("，%d 分钟后自动停止", data.Duration)
  else
    msg += "，需手动停止"

  if (isDebug) 
    msg += "\n播放频率：" + "测试模式下仅播放一次"
  else
    msg += "\n播放频率：" + (data.OnlyWeekday ? "仅工作日" : "每天")

  console.log(msg)
}


module.exports = {
  schedule: schedule
}
