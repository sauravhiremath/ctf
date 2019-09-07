import User from "../models/user";

export async function checkUserExists(username: string, email: string, regNo: string) {
    const user = await User.findOne({
        $or: [{ "username": username }, { "email": email }, {"regNo": regNo}]
    }).exec();
    console.log(user);
    return user;
}
