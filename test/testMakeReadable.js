var makeReadable = require('../lib/makeReadable')

makeReadable.schedule({
  Hour: 8,
  Minute: 30
}, false)

makeReadable.schedule({
  Hour: 8,
  Minute: 30
}, true)

makeReadable.schedule({
  Hour: 20,
  Minute: 30,
  Duration: 3
}, false)

makeReadable.schedule({
  Hour: 20,
  Minute: 30,
  OnlyWeekday: true
}, false)

