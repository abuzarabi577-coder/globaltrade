import Task from "../DBModels/Tasks.js";

// controllers/taskController.js - ✅ UPDATE FUNCTION
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = req.body;
    
    //console.log('📝 Updating task:', id, taskData);
    
    const updatedTask = await Task.findByIdAndUpdate(
      id, 
      { ...taskData, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });
    
  } catch (error) {
    //console.error('💥 Update task error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
