import mongoose from "mongoose";

export const connectDB = async () => {
   
    await mongoose.connect('mongodb+srv://raj-trivedi:rajfoodelivery@cluster1.nsarrwv.mongodb.net/fooddel')
    .then(()=> console.log("MongoDB connected successfully"))
}
