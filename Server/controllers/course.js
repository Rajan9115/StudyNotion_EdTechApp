const Category = require('../models/category');
const Course = require('../models/Courses');
const {uploadFileToCloudinary} = require('../utils/fileUploader');
const { populate } = require('../models/profile');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const User = require("../models/user")

const CourseProgress = require("../models/courseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      category,
      price,
      whatYouWillLearn,
      tag,
    } = req.body

    const file = req.files?.thumbnail

    if (!courseName || !courseDescription || !category || !price || !file) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }

    const uploadDetails = await uploadFileToCloudinary(
      file,
      process.env.FOLDER
    )

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      Category: category,
      price,
      Instructor: req.user.id,
      WhatYouWillLearn: whatYouWillLearn,
      tags: JSON.parse(tag),
      instructions: JSON.parse(req.body.instructions),
      thumbnail: uploadDetails.secure_url,
      status: "Draft",
    })

    await Category.findByIdAndUpdate(
      category,
      { $push: { Courses: newCourse._id } },
      { new: true }
    )

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}


//get all courses handler
exports.getAllCourses = async (req, res) => {
    try{
        const courses = await Course.find();
        return res.status(200).json({ success: true, courses });
    }catch(err){
        console.error("Error fetching courses:",err);
        return res.status(500).json({ error: 'Internal server error' });
        }
}

//get course details handler 
exports.getCourseDetails = async (req, res) => {
    try{
        //get coures id 
        const { courseId } = req.params;
        //find course by id
        const courseDetails = await Course.findById(courseId)
                                          .populate({
                                            path:"Instructor",
                                            populate:{
                                                path:"AdditionalDetails",
                                            }
                                          })
                                          .populate("Category")
                                          .populate("RatingandReviews")
                                          .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                                select: "-videoUrl",
                                            }
                                          })
                                            .exec();
        //handle case if no course found
        if(!courseDetails){
            return res.status(404).json({ 
                error: 'Course not found' });
        }
       
        //Calculate total duration
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
          content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        //Send response
        return res.status(200).json({
             success: true, 
             courseDetails ,
             totalDuration
            });
    }catch(err){
        console.error("Error fetching course details:",err);
        return res.status(500).json
        ({ error: 'Internal server error' });
    }
}


// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnail
      const thumbnailImage = await uploadFileToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
       // ✅ SAFE UPDATE LOOP
    for (const key in updates) {
      if (key === "tag" || key === "instructions") {
        course[key] = JSON.parse(updates[key])
      } else if (key !== "courseId") {
        course[key] = updates[key]
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "Instructor",
        populate: {
          path: "AdditionalDetails",
        },
      })
      .populate("Category")
      .populate("RatingandReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
// Get Course List
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}
// Get One Single Course Details
// exports.getCourseDetails = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const courseDetails = await Course.findOne({
//       _id: courseId,
//     })
//       .populate({
//         path: "instructor",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec()
//     // console.log(
//     //   "###################################### course details : ",
//     //   courseDetails,
//     //   courseId
//     // );
//     if (!courseDetails || !courseDetails.length) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find course with id: ${courseId}`,
//       })
//     }

//     if (courseDetails.status === "Draft") {
//       return res.status(403).json({
//         success: false,
//         message: `Accessing a draft course is forbidden`,
//       })
//     }

//     return res.status(200).json({
//       success: true,
//       data: courseDetails,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }
// exports.getCourseDetails = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const courseDetails = await Course.findOne({
//       _id: courseId,
//     })
//       .populate({
//         path: "instructor",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//           select: "-videoUrl",
//         },
//       })
//       .exec()

//     if (!courseDetails) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find course with id: ${courseId}`,
//       })
//     }

//     // if (courseDetails.status === "Draft") {
//     //   return res.status(403).json({
//     //     success: false,
//     //     message: `Accessing a draft course is forbidden`,
//     //   });
//     // }

//     let totalDurationInSeconds = 0
//     courseDetails.courseContent.forEach((content) => {
//       content.subSection.forEach((subSection) => {
//         const timeDurationInSeconds = parseInt(subSection.timeDuration)
//         totalDurationInSeconds += timeDurationInSeconds
//       })
//     })

//     const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

//     return res.status(200).json({
//       success: true,
//       data: {
//         courseDetails,
//         totalDuration,
//       },
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "Instructor",
        populate: {
          path: "AdditionalDetails",
        },
      })
      .populate("Category")
      .populate("RatingandReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    // console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


// Get a list of Courses for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // 1️⃣ Fetch courses with nested data
    const instructorCourses = await Course.find({
      Instructor: instructorId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "timeDuration", // only need duration
        },
      });

    // 2️⃣ Attach totalDuration to each course
    const coursesWithDuration = instructorCourses.map((course) => {
      let totalSeconds = 0;

      course.courseContent.forEach((section) => {
        section.subSection.forEach((lecture) => {
          totalSeconds += Number(lecture.timeDuration || 0);
        });
      });

      // Convert to readable format
      const readableDuration = convertSecondsToDuration(totalSeconds);

      return {
        ...course.toObject(),   // convert mongoose doc to plain object
        totalDuration: readableDuration,
      };
    });

    // console.log("Instructor courses with duration:", coursesWithDuration);

    res.status(200).json({
      success: true,
      data: coursesWithDuration,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    // Unenroll students
    for (const studentId of course.StudentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections & subsections
    for (const sectionId of course.courseContent) {
      const section = await Section.findById(sectionId)

      if (section) {
        for (const subSectionId of section.subSection) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      await Section.findByIdAndDelete(sectionId)
    }

    // Delete course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}