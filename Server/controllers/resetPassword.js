const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mailSender = require('../utils/mailSender');
const resetPasswordTemplate = require('../templates/resetPasswordTemplate');

//reset password token
exports.resetPasswordToken = async (req,res) => {
    try{
      //fetch email from req body
        const {email} = req.body;
        if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
        }
        //find user by email
        const user = await User.findOne({ Email: email.toLowerCase() });
        if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
        }
        //generate token
        const token = crypto.randomBytes(20).toString('hex');
        //set token and expiry on user
        user.Token = token;
        user.TokenExpiry = Date.now() + 3600000;
        await user.save();
        //create reset url
        const resetUrl = `http://localhost:5173/update-password/${token}`;
        const htmlContent = resetPasswordTemplate(user.FirstName, resetUrl);
        //send email
        await mailSender(email,"Password Reset Request",htmlContent);
        return res.status(200).json({
            success:true,
            message:"Password reset link sent to your email"
        });
    }catch(err){
            console.error("Error in resetPasswordToken",err);
            return res.status(500).json({
                success:false,
                message:"Error in resetPasswordToken",
                err:err.message
            });
        }
    }
//reset password
exports.resetPassword = async (req,res) => {
    try{
            //fetch data from req body
            const {token,newPassword,confirmPassword } = req.body;
            //validate fields
            if( !newPassword || !confirmPassword){
                return res.status(400).json({
                    success:false,
                    message:"All fields are required"
               });
            }
            //check if passwords match
            if(newPassword !== confirmPassword){
                return res.status(400).json({
                    success:false,
                    message:"Passwords do not match"
                });
            }
            //find user by email and token and check token expiry
            const user = await User.findOne({  Token: token, TokenExpiry: { $gt: Date.now() } });
            if(!user){
                return res.status(400).json({
                    success:false,
                    message:"Invalid or expired token"
                });
            }
            //hash new password
            const hashedPassword = await bcrypt.hash(newPassword,10);
            //update user's password and clear token fields
            user.Password = hashedPassword;
            user.Token = undefined;
            user.TokenExpiry = undefined;
            await user.save();
            return res.status(200).json({
                success:true,
                message:"Password reset successful"
            });
            

    }catch(err){
            console.error("Error in resetPassword",err);
            return res.status(500).json({
                success:false,
                message:"Error in resetPassword",
                error:err.message
            });
        }
}