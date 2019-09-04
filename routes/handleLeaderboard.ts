import {io as io} from '../server';

type data = {
    userid: string;
    pointsScored: number;
}

export let handleLeaderboard: (userid: string, pointsScored: number) => any = 
    function(userid, pointsScored){
        function getUserpoints(){
            io.sockets.emit('userPoints', {userid, pointsScored});     //data = {userid, pointsScored}
        }
    }

// module.exports = handleLeaderboard;