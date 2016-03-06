var i18n = require('../lib/i18n')

i18n.schedule({
  Hour: 8,
  Minute: 30
}, false)

i18n.schedule({
  Hour: 8,
  Minute: 30
}, true)

i18n.schedule({
  Hour: 20,
  Minute: 30,
  Duration: 3
}, false)

i18n.schedule({
  Hour: 20,
  Minute: 30,
  OnlyWeekday: true
}, false)

