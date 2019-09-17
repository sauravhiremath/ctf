import User from "../models/user";

export async function checkUserExists(username: string, email: string) {
    const user = await User.findOne({
        $or: [{ "username": username }, { "email": email }]
    }).exec();
    return user;
}
