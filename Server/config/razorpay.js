const { configDotenv } = require("dotenv");
const Razorpay = require("razorpay");
configDotenv();

exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});