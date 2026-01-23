const express = require('express');
const router = express.Router();
const{auth} = require('../middlewares/auth');
const{updateProfile,deleteProfile,getAllUserDetails,getEnrolledCourses,instructorDashboard} = require('../controllers/profile');

//profile routes

//delete user account
router.delete('/deleteProfile',auth,deleteProfile);
//update profile
router.put('/updateProfile',auth,updateProfile);
//get all user details
router.get('/getAllUserDetails',auth,getAllUserDetails);


// router.put('/updateDisplayPicture',auth,updateDisplayPicture);
//get enrolledCourses
router.get('/getEnrolledCourses',auth,getEnrolledCourses);

//get instructor dashboard data
router.get('/instructorDashboard',auth,instructorDashboard);


module.exports = router;