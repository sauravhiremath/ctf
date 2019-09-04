import { io } from "../server";

type data = {
    userid: string;
    pointsScored: number;
};

export let handleLeaderboard = function (userid, pointsScored) {
    return function getUserpoints() {
        io.sockets.emit("userPoints", { userid, pointsScored }); //data = {userid, pointsScored}
    };
};

// module.exports = handleLeaderboard;
