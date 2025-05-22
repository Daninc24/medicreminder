const reminderService = require('../services/reminderService');

class ReminderWorker {
  constructor() {
    this.interval = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.interval = setInterval(async () => {
      try {
        await reminderService.processReminders();
      } catch (error) {
        console.error('Error in reminder worker:', error);
      }
    }, 60000); // Check every minute

    console.log('Reminder worker started');
  }

  stop() {
    if (!this.isRunning) return;

    clearInterval(this.interval);
    this.isRunning = false;
    console.log('Reminder worker stopped');
  }
}

module.exports = new ReminderWorker(); 