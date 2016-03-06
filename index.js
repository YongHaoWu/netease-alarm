#!/bin/bash
var logger = require('./lib/logger')
var config = require('./lib/config')
var alarm = require('./lib/startAlarm')
var lookupDevice = require('./lib/lookupDevice')

lookupDevice(function(err) {
  if (err) {
    exit(err)
    return
  }
  alarm(exit)
})

function exit(err) {
  if (err) {
    logger.warn(err)
    return process.exit(1)
  }

  process.exit(0)
}