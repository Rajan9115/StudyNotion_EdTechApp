const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = (req, res, next) => {
  try {
    //get token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }
    //verify token using JWT_SECRET
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeToken;
    next();
  } catch (err) {
    console.error("Error while authentication", err);
    return res.status(500).json({
      success: false,
      message: "unable to authenticate the user",
    });
  }
};

//isStudent
exports.isStudent = (req, res, next) => {
  try {
    if (req.user.AccountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "This route is only for student",
      });
    }
    next();
  } catch (err) {
    console.error("Error in isStudent middleware", err);
    return res.status(500).json({
      success: false,
      message: "you are not a student",
    });
  }
};

//isInstructor
exports.isInstructor = (req, res, next) => {
  try {
    if (req.user.AccountType !== "Instructor") {
    

      return res.status(403).json({
        success: false,
        message: "This route is only for instructor",
      });
      
    }
    next();
  } catch (err) {
    console.error("Error in isInstructor middleware", err);
    return res.status(500).json({
      success: false,
      message: "you are not an instructor",
    });
  }
};

//isAdmin
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.AccountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "This route is only for admin",
      });
    }
    next();
  } catch (err) {
    console.error("Error in isAdmin middleware", err);
    return res.status(500).json({
      success: false,
      message: "you are not an admin",
    });
  }
};
