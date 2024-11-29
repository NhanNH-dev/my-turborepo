import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username?: string;   
  password?: string;   
  email?: string;      
  googleId?: string;   
  provider: string;
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String },
  password: { type: String, required: false },
  provider: { type: String },
  profilePicture: { type: String },
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
