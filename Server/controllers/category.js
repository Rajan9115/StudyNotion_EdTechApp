const Category = require('../models/category');
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

//create category handler
exports.createCategory = async (req, res) => {
    try{
        //Fetch data from request body
        const { Name, Description } = req.body;
        //Validation
        if(!Name || !Description){
            return res.status(400).json({ 
                error: 'Name and Description are required' });
        }
        //Create new category
        const newCategory = new Category({ Name, Description });
        await newCategory.save();
        console.log(newCategory);
        //Send response
        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category: newCategory   
        });

    }catch(err){
        console.error("Error handling category:",err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


//get all categories handler
exports.getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find();
        return res.status(200)
        .json({ 
            success: true,
            categories
            });

    }catch(err){
        console.error("Error fetching categories:",err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.query

    // ================= SELECTED CATEGORY =================
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "Courses",
        match: { status: "Published" },
        populate: {
          path: "RatingandReviews",
          select: "rating",
        },
      })

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    if (selectedCategory.Courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this category",
      })
    }

    // ================= OTHER CATEGORIES =================
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    }).populate({
      path: "Courses",
      match: { status: "Published" },
      populate: {
        path: "RatingandReviews",
        select: "rating",
      },
    })

    const differentCategory = {
      Courses: categoriesExceptSelected.flatMap(
        (category) => category.Courses
      ),
    }

    // ================= MOST SELLING COURSES =================
    const allCategories = await Category.find().populate({
      path: "Courses",
      match: { status: "Published" },
      populate: [
        {
          path: "RatingandReviews",
          select: "rating",
        },
        {
          path: "Instructor",
          select: "FirstName LastName",
        },
      ],
    })

    const allCourses = allCategories.flatMap(
      (category) => category.Courses
    )

    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
