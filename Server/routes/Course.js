const express = require('express');
const router = express.Router();

//course controllers import
const {createCourse,getAllCourses,getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
}
 = require('../controllers/course');

//category controllers import
const{createCategory,getAllCategories,categoryPageDetails} = require('../controllers/category');

//section controllers import
const{createSection,updateSection,deleteSection} = require('../controllers/section');

//subsection controllers import
const{createSubSection,updateSubSection,deleteSubSection} = require('../controllers/subSection');

//rating controllers import
const{createRating,getAverageRating,getAllRatingsAndReviews} = require('../controllers/ratingAndReview');

//course progress controllers import
const {
  updateCourseProgress
} = require("../controllers/courseProgress");

//importing middlewares
const{auth,isInstructor,isAdmin,isStudent} = require('../middlewares/auth');

//course routes
//course can only be created by Instructor
router.post('/createCourse',auth,isInstructor,createCourse);
//add a section to a course
router.post('/addSection',auth,isInstructor,createSection);
//update a section details
router.put('/updateSection',auth,isInstructor,updateSection);
//delete a section
router.delete('/deleteSection',auth,isInstructor,deleteSection);
//add a subsection to a section
router.post('/addSubSection',auth,isInstructor,createSubSection);
//update a subsection details
router.put('/updateSubSection',auth,isInstructor,updateSubSection);
//delete a subsection
router.delete('/deleteSubSection',auth,isInstructor,deleteSubSection);
//get all courses
router.get('/getAllCourses',getAllCourses);
//get specific course details
router.get('/getCourseDetails/:courseId',getCourseDetails);
// Get Details for a Specific Courses
router.get("/getFullCourseDetails/:courseId", auth, getFullCourseDetails)
// Edit Course routes
router.put("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)
//update course progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
   
//admin can create category
router.post('/createCategory',auth,isAdmin,createCategory);
//get all categories
router.get('/getAllCategories',getAllCategories);
//get category page details
router.get('/categoryPageDetails',categoryPageDetails);

//create rating and review for a course
router.post('/createRating',auth,isStudent,createRating);
//get average rating for a course
router.get('/getAverageRating',getAverageRating);
//get all ratings and reviews for a course
router.get('/getReviews',getAllRatingsAndReviews);


module.exports = router;