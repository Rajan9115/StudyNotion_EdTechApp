const express = require('express');
const router = express.Router();
const {auth} = require('../middlewares/auth');
const { logIn,signUp,sendOtp,changePassword } = require('../controllers/auth');
const{resetPasswordToken,resetPassword} = require('../controllers/resetPassword');

//auth routes
router.post('/login',logIn);
router.post('/signup',signUp);
router.post('/sendotp',sendOtp);
router.post('/changepassword',auth,changePassword);

//reset password routes
router.post('/reset-password-token',resetPasswordToken);
router.post('/reset-password',resetPassword);


module.exports = router;