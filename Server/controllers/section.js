const Section = require('../models/section');
const Course = require('../models/courses');

// Create a new section
exports.createSection = async (req, res) => {
    try{
        // Fetch data from request body
        const { sectionName, courseId } = req.body;
        // Validation
        if(!sectionName || !courseId){
            return res.status(400).json({ 
                error: 'Section name and Course ID are required' });
        }
        // Create new section
        const newSection = await Section.create({ sectionName });
        console.log(newSection);
        // Associate section with course
        const course = await Course.findByIdAndUpdate(courseId, 
            { $push: { courseContent: newSection._id } }, 
            { new: true })
            .populate({path: "courseContent", populate: { path: "subSection" }}).exec();
        //populate the section and subsection details in the course
        // await course.populate('courseContents');
        // Send response
        return res.status(201).json({
            success: true,
            message: 'Section created and associated with course successfully',
            section: newSection,
            course: course,
        });
    }catch(err){
        console.error("Error creating section:",err);
        return res.status(500).json({ 
            success: false,
            message:"error creating section",
        });
    }
}


//update section details
exports.updateSection = async (req, res) => {
    try{
        // Fetch data from request body
        const { sectionId,courseId } = req.body;//req.params
        const { sectionName } = req.body;
        // Validation
        if(!sectionId || !sectionName){
            return res.status(400).json({ 
                error: 'Section ID and new Section name are required' });
        }
        // Update section details
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId, 
            { sectionName }, 
            { new: true }
        );
        if(!updatedSection){
            return res.status(404).json({ 
                error: 'Section not found' });
        }
         // 🔥 FETCH UPDATED COURSE
            const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                path: "subSection",
                },
            })
            .exec() 
        // Send response
        return res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            section: updatedSection,
            course: updatedCourse,
            
        });
    }catch(err){
        console.error("Error updating section:", err);
        return res.status(500).json({
            success: false,
            message: "Error updating section",
        });
    }
}


//delete section
exports.deleteSection = async (req, res) => {
    try{
        // Fetch section ID from request params
        const { sectionId, courseId } = req.body;//req.params
        // Validation
        if(!sectionId){
            return res.status(400).json({ 
                error: 'Section ID is required' });
        }
        // Delete section
        const deletedSection = await Section.findByIdAndDelete(sectionId);
        //update course to remove this section from courseContent array
        await Course.updateMany(
            { courseContent: sectionId },
            { $pull: { courseContent: sectionId } }
        );
         // 🔥 FETCH UPDATED COURSE
            const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                path: "subSection",
                },
            })
            .exec() 
        // Send response
        return res.status(200).json({
            success: true,
            message: 'Section deleted successfully',
            section: deletedSection,
            course: updatedCourse,
        });
    }catch(err){ 
        console.error("Error deleting section:", err);
        return res.status(500).json({
            success: false,
            message: "Error deleting section",
        });
    }
}