import User from "../models/user";
import feedback from "../models/feedback";

export async function checkUserExists(username: string, email: string) {
    const user = await User.findOne({
        $or: [{ "username": username }, { "email": email }]
    }).exec();
    return user;
}

export async function checkUserExists2(username: string) {
    const user = await feedback.findOne( { "username": username }).exec();
    const user2 = await User.findOne( { "username": username }).exec();
    const final = user || user2
    return user;
}
