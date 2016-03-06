var tracer = require('tracer')
var path = require('path')

var consoleLogger = tracer.colorConsole({
  format : "{{message}}",
});

var fileLogger = tracer.dailyfile({
  root: path.join(__dirname, '../logs'),
  logPathFormat: '{{root}}/{{date}}.log',
  format : "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
  transport: function (data) {
    consoleLogger[data.title](data.output)
  },
  maxLogFiles: 10
});

module.exports = fileLogger