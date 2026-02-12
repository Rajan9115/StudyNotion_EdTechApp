const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const otpMailTemplate = require('../templates/otpMailTemplate');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true },
  otp: { type: String, required: true, trim: true },
  expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 5 * 60 * 1000) } // 5 minutes from now
}, { timestamps: true });

// Create TTL index to automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });





module.exports = mongoose.models.OTP || mongoose.model('OTP', otpSchema);
