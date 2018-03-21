const schedule = require("node-schedule")
const task = require('../task')

const execRule = new schedule.RecurrenceRule()

execRule.dayOfWeek = [1, 3, 5];
execRule.hour = 22;
execRule.minute = 0;

module.exports = function () {
  schedule.scheduleJob(execRule, task)
}