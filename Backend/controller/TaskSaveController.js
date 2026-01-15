// controllers/taskController.js - ✅ COMPLETE EXPORT
import Task from "../DBModels/Tasks.js";

 const SaveTasks = async (req, res) => {
  try {
    const tasksData = req.body.tasks;
    //console.log('📥 Tasks received:', tasksData);
    
    const savedTasks = await Task.insertMany(tasksData);
    
    res.json({
      success: true,
      message: 'Tasks saved to database',
      tasks: savedTasks
    });
  } catch (error) {
    //console.error('💥 Save error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default SaveTasks