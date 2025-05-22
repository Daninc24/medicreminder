const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { Client } = require('whatsapp-web.js');
const webpush = require('web-push');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize WhatsApp client
const whatsappClient = new Client({
  puppeteer: {
    args: ['--no-sandbox']
  }
});

// Initialize web push
webpush.setVapidDetails(
  'mailto:' + process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

class ReminderService {
  constructor() {
    this.initializeWhatsApp();
  }

  async initializeWhatsApp() {
    try {
      await whatsappClient.initialize();
      console.log('WhatsApp client initialized');
    } catch (error) {
      console.error('Error initializing WhatsApp client:', error);
    }
  }

  async sendEmailReminder(appointment, user) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: `Appointment Reminder: ${appointment.type}`,
        html: `
          <h2>Appointment Reminder</h2>
          <p>Dear ${user.firstName} ${user.lastName},</p>
          <p>This is a reminder for your upcoming appointment:</p>
          <ul>
            <li>Date: ${new Date(appointment.date).toLocaleDateString()}</li>
            <li>Time: ${appointment.startTime}</li>
            <li>Type: ${appointment.type}</li>
            <li>Doctor: Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}</li>
          </ul>
          <p>Please arrive 10 minutes before your scheduled time.</p>
          <p>If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
        `
      };

      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email reminder:', error);
      return false;
    }
  }

  async sendSMSReminder(appointment, user) {
    try {
      const message = `Reminder: You have an appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}.`;

      await twilioClient.messages.create({
        body: message,
        to: user.phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER
      });

      return true;
    } catch (error) {
      console.error('Error sending SMS reminder:', error);
      return false;
    }
  }

  async sendWhatsAppReminder(appointment, user) {
    try {
      const message = `Reminder: You have an appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}.`;

      await whatsappClient.sendMessage(`${user.phoneNumber}@c.us`, message);
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp reminder:', error);
      return false;
    }
  }

  async sendPushNotification(appointment, user) {
    try {
      if (!user.pushSubscription) return false;

      const payload = JSON.stringify({
        title: 'Appointment Reminder',
        body: `You have an appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime}`,
        icon: '/icon.png',
        data: {
          appointmentId: appointment._id
        }
      });

      await webpush.sendNotification(user.pushSubscription, payload);
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  async processReminders() {
    try {
      const now = new Date();
      const appointments = await Appointment.find({
        date: { $gte: now },
        'reminders.sent': false,
        'reminders.scheduledFor': { $lte: now }
      }).populate('doctor patient');

      for (const appointment of appointments) {
        const patient = await User.findById(appointment.patient);
        const doctor = await User.findById(appointment.doctor);

        for (const reminder of appointment.reminders) {
          if (!reminder.sent && reminder.scheduledFor <= now) {
            let sent = false;

            switch (reminder.type) {
              case 'email':
                sent = await this.sendEmailReminder(appointment, patient);
                break;
              case 'sms':
                sent = await this.sendSMSReminder(appointment, patient);
                break;
              case 'whatsapp':
                sent = await this.sendWhatsAppReminder(appointment, patient);
                break;
              case 'push':
                sent = await this.sendPushNotification(appointment, patient);
                break;
            }

            if (sent) {
              reminder.sent = true;
              reminder.sentAt = new Date();
            }
          }
        }

        await appointment.save();
      }
    } catch (error) {
      console.error('Error processing reminders:', error);
    }
  }
}

module.exports = new ReminderService(); 