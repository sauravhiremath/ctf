import User from "../models/user";
import feedback from "../models/feedback";

export async function checkUserExists(username: string, email: string) {
    const user = await User.findOne({
        $or: [{ "username": username }, { "email": email }]
    }).exec();
    return user;
}

export async function checkUserExists2(username: string) {
    const user2 = await User.findOne( { "username": username });
    if(user2 === null) {return user2};
    // console.log(user2);
    const user = await feedback.findOne( { "username": username });
    if(user != null) {return null};
    // console.log(user);
    return "yes";


}
