import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://raj-trivedi:fooddelivery22@cluster1.nsarrwv.mongodb.net/food-delivery')
    .then(()=> console.log("MongoDB connected successfully"))
}
