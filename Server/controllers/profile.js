const Profile = require('../models/profile');
const User = require('../models/user');
const cloudinary = require('cloudinary').v2;
const CourseProgress = require("../models/courseProgress")

const Course = require("../models/Courses")
const { uploadFileToCloudinary } = require("../utils/fileUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")

  //update profile
  exports.updateProfile = async(req,res)=>{
    try{
        //get data
        const {dob="",gender,about="",contactNumber,FirstName,LastName} = req.body;

        
        //get userid
        const Id = req.user.id;
      
        //find profile
        const userDetails = await User.findById(Id);
        const profileId = userDetails.AdditionalDetails;
        const profileInfo = await Profile.findById(profileId);

         
        let imageUrl 
        


        //  If user uploaded new image file
        if (req.files && req.files.image) {
        const uploadedImage = await uploadFileToCloudinary(
            req.files.image,
            process.env.FOLDER_NAME
        );
        imageUrl = uploadedImage.secure_url;
    }
        //update user
        userDetails.FirstName = FirstName;
        userDetails.LastName = LastName;
        await  userDetails.save();

        //update profile
        profileInfo.dob = dob;
        profileInfo.gender = gender;
        profileInfo.about = about;
        profileInfo.contactNumber = contactNumber;
        profileInfo.Image = imageUrl ;
        await profileInfo.save();
        //return response
        // console.log("req.files:", req.files)
        // console.log("req.body:", req.body)
        // console.log("Profile updated successfully");
        // console.log("imageurl is", imageUrl);
        // console.log("profileInfo is", profileInfo);
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileInfo,
            user: await User.findById(Id).populate("AdditionalDetails").exec(),
        });
         
    }catch(err){
        console.error("Error in updateProfile",err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error: err.message
        });
    }
  }


  //delete account
  //TODO: how can we sechedule account recovery before permanent deletion
  exports.deleteProfile = async(req,res)=> {
    try{
        //get userid
        const Id = req.user.id;
        
        //validaion
        const userDetails = await User.findById(Id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found",
                error:"User not found"
            });
        }
        //delete profile
        const profileId = userDetails.AdditionalDetails;
        await Profile.findByIdAndDelete(profileId);
        //TODO: unenroll from courses
        //delete user
        await User.findByIdAndDelete(Id);
        //return response
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully"
        });


    }
    catch(err){
        console.error("Error in deleteAccount",err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error: err.message
        });
    }
  }


  //get all user data
  exports.getAllUserDetails = async(req,res)=>{
    try{
        //get id
        const Id = req.user.id;

        //validation and et user details
        const userDetails = await User.findById(Id).populate('AdditionalDetails').exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"User details fetched successfully",
            userDetails
        }); 
    }
    catch(err){
        console.error("Error in getAllUserDetails",err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error: err.message
        });
    }
  }


  exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "Courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.Courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.Courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.Courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.Courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.Courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseId: userDetails.Courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.Courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.Courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.Courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ Instructor: req.user.id })
     
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.StudentsEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }