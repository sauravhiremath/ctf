import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "leaderboard"
    },
    name: { type: String, required: true },
    regNo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: Number, required: true, unique: true },
    solved: Array,
    points: { type: Number, default: 0 },
    role: { type: String, default: "participant" }
  },
);

export function validateName(name: string) {
  return true;
}

export function validateRegNo(regno: string) {
  return true;
}

export function validatePassword(password: string) {
  return true;
}

export function validateEmail(email: string) {
  return true;
}

export function validatePhoneNo(phoneno: string) {
  return true;
}

export const User = mongoose.model("User", userSchema);
export default User;
