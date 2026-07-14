import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const deleteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const userSchema = new mongoose.Schema({
      email: String,
      username: String
    }, { strict: false });
    const User = mongoose.model("User", userSchema);

    const result = await User.deleteMany({ email: "amardeep72099@gmail.com" });
    console.log(`Deleted ${result.deletedCount} stuck user(s)`);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

deleteUser();
