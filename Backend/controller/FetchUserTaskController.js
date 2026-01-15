import Task from "../DBModels/Tasks.js";

 const fetchUserTasks = async (req, res) => {
  try {
    // Fetch all active tasks from DB
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
    
    
    res.json({
      success: true,
      message: 'Tasks fetched successfully',
      tasks
    });
    
  } catch (error) {
    //console.error('💥 Fetch tasks error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tasks'
    });
  }
};
export default fetchUserTasks