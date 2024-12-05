import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  email: string;
  name: string;
  image?: string;
  password?: string;
  provider: 'email' | 'google';
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String, required: true, enum: ['email', 'google'] },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
