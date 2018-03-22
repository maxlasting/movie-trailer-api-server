const schedule = require("node-schedule")
const task = require('../task')

const execRule = new schedule.RecurrenceRule()

execRule.dayOfWeek = [1, 4, 5];
execRule.hour = 18;
execRule.minute = 43;

module.exports = function () {
  schedule.scheduleJob(execRule, task)
}