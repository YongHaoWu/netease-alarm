var osascript = require('node-osascript')

function fadeIn (toVolume, fromVolume, cb) {
  toVolume = toVolume > 100 ? 100 : toVolume
  fromVolume = fromVolume || Math.max(toVolume - 30, 0)
  tuneVolume(fromVolume, toVolume, (toVolume - fromVolume) / 10, cb)
}

function fadeOut (toVolume, fromVolume, cb) {
  toVolume = toVolume < 0 ? 0 : toVolume
  fromVolume = fromVolume || Math.min(toVolume - 30, 100)
  tuneVolume(toVolume, fromVolume, (toVolume - fromVolume) / 10, cb)
}

function tuneVolume (fromVolume, toVolume, step, cb) {
  var isAscending = toVolume - fromVolume > 0
  _fn(fromVolume)

  function _fn (volume) {
    setVolume(volume, function (err) {
      if (err)
        return cb('setVolume error: ' + err)

      if (volume >= 0 && volume <= 100) {
        if (isAscending && volume < toVolume) {
          return _fn(volume + step)
        } else if (!isAscending && volume > toVolume) {
          return _fn(volume - step)
        }
      }
      if (cb) cb()
    })
  }
}

function setVolume (volume, cb) {
  osascript.execute('set volume output volume ' + volume, function (err) {
    if (cb) cb(err)
  })
}

function getVolume (cb) {
  osascript.execute('set ovol to output volume of (get volume settings)', function(err, result, raw) {
    if (err) return cb(err)

    cb(null, result)
  })
}

module.exports = {
  fadeIn: fadeIn,
  fadeOut: fadeOut,
  set: setVolume,
  get: getVolume
}

