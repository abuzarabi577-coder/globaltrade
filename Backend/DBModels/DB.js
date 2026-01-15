import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Add this line

const connectDB = async () => {
  try {
     if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env file');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export default connectDB; // Default export MUST
