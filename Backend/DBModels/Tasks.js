// models/Task.js - COMPLETE TASKS MODEL ✅ DEFAULT EXPORT
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  // Basic Task Info
  name: {
    type: String,
    required: [true, 'Task name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  points: {
    type: Number,
    required: [true, 'Points are required'],
   
  },

  // Task Categorization ✅ FIXED
  category: {
    type: String,
   
    required: [true, 'Category is required']
  },

  // External Links
  url: {
    type: String,
    trim: true
  },

 
 
  // Timestamps ✅ IMPROVED
  createdAt: {
    type: Date,
    default: Date.now
  },
 
});


// ✅ DEFAULT EXPORT
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
