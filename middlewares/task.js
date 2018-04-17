const schedule = require("node-schedule")
const task = require('../task')

const execRule = new schedule.RecurrenceRule()

execRule.dayOfWeek = [1];
execRule.hour = 3;
execRule.minute = 0;

module.exports = function () {
  schedule.scheduleJob(execRule, task)
}