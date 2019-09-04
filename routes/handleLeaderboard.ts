import { io } from "../server";

type data = {
    userid: string;
    pointsScored: number;
};

export let handleLeaderboard = function (data:data) {
    return function getUserpoints() {
        io.sockets.emit("userPoints", data); //data = {userid, pointsScored}
    };
};

// module.exports = handleLeaderboard;
