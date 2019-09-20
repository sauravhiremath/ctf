import User from "../models/user";
import Leaderboard from "../models/leaderboard";

export async function name(){
    const users = await User.find({verifiedStatus: true}, {username: 1, points: 1});

    Leaderboard.insertMany(users);

};

export default name;
