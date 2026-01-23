const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => {
        console.log("MongoDB connection error:", err);
        process.exit(1);
    });
};
