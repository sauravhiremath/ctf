import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    regNo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: Number, required: true },
    solved: Array,
    points: { type: Number, default: 0, required: true },
    role: { type: String, default: "VITparticipant" },
    verifiedStatus: {type: Boolean, required: true} 
  },
);

export function validateName(name: string) {
  const nameRegex = /^[a-zA-Z`!@#$%^&*]{3,20}$/;
  return nameRegex.test(name)
}

export function validateUsername(username: string) {
  const usernameRegex = /^[a-zA-Z0-9_`!@#$%^&*]{3,20}$/;
  return usernameRegex.test(username);
}

export function validateRegNo(regno: string) {
  const regNumRegex = /^1\d[a-zA-Z]{3}\d{4}$/;
  return regNumRegex.test(regno);
}

export function validatePassword(password: string) {
  //Loll, gimme strong password. I saw ur password :)))))
  return true;
}

export function validateEmail(email: string) {
  const emailRegex =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

export function validatePhoneNo(phoneno: string) {
  const phoneRegex = /^[2-9]{2}[0-9]{8}$/;
  return phoneRegex.test(phoneno);
}

export const User = mongoose.model("User", userSchema);
export default User;
