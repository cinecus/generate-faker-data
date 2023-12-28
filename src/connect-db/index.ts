import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config({ path: '.env.develop' });

export async function connectToDatabase() {
    try {
        const uri = process.env.CONNECTION_URI as string
        await mongoose.connect(uri);

        console.log('Connected to MongoDB Atlas');

    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
}
