#!/bin/bash
var logger = require('../lib/logger')
var stopAlarm = require('../lib/stopAlarm')

stopAlarm(exit)

function exit(err) {
  if (err) {
    logger.warn(err)
    return process.exit(1)
  }

  process.exit(0)
}