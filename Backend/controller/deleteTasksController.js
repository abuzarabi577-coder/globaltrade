import Task from "../DBModels/Tasks.js";

// controllers/taskController.js
 const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    //console.log('🗑️ Deleting task:', id);
    
    const deletedTask = await Task.findByIdAndDelete(id);
    
    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully',
      deletedTask
    });
    
  } catch (error) {
    //console.error('💥 Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export default deleteTask