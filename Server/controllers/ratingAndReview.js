const RatingandReviews = require('../models/ratingAndReview');
const Course = require('../models/courses');

//create rating
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId, rating, review } = req.body

    // Check enrollment
    const courseDetails = await Course.findOne({
      _id: courseId,
      StudentsEnrolled: { $elemMatch: { $eq: userId } },
    })

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "User not enrolled in the course",
      })
    }

    // Check already reviewed
    const alreadyReviewed = await RatingandReviews.findOne({
      course: courseId,
      user: userId,
    })

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "User has already reviewed this course",
      })
    }

    // Create review
    const ratingReview = await RatingandReviews.create({
      course: courseId,
      user: userId,
      rating,
      review,
    })

    // Push review into course
    await Course.findByIdAndUpdate(courseId, {
      $push: { RatingandReviews: ratingReview._id },
    })

    return res.status(201).json({
      success: true,
      message: "Rating & review added",
      ratingReview,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}



//get average rating of a course
exports.getAverageRating = async (req, res) => {
    try{
        //get course id from req body
        const courseId = req.body.courseId;
        //calculate average rating using aggregation

        const result = await RatingandReviews.aggregate([
            { $match: { course: mongoose.Types.ObjectId(courseId) } },
            {
                $group: {
                    _id: 'null',
                    averageRating: { $avg: '$rating' },
                
                }
            }
        ]);
        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating
            });
        }
        else {
            return res.status(200).json({
                success:true,
                averageRating: 0
            });
        }
    }
    catch(err){
        console.error("Error calculating average rating:", err);
        return res.status(500).json({
            success:false,
            message:err.message
        });

    }
}


//get all ratings and reviews for a course
exports.getAllRatingsAndReviews = async (req, res) => {
    try{
        const allRatingsAndReviews = await RatingandReviews.find({ })
                                           .sort({ rating:"desc" })
                                           .populate({
                                            path:"user",
                                            select:"FirstName LastName Email AdditionalDetails",
                                              populate: {
                                                        path: "AdditionalDetails",
                                                        select: "Image",
                                                        },
                                           })
                                           
                                           .populate({
                                            path:"course",
                                            select:"courseName"
                                           })
                                           .exec();
        return res.status(200).json({
            success:true,
            message:"All ratings and reviews fetched successfully",
            data: allRatingsAndReviews
        });
    }
    catch(err){
        console.error("Error fetching ratings and reviews:", err);
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
}