import {io as io} from '../server';

// type data = {
//     userid ? : string;
//     pointsScored ? : number;
// }

export function handleLeaderboard({userid ='test', pointsScored =50}: {userid ?: string, pointsScored ?: number}={}){
    // let {userid = 'test', pointsScored = 50} = params;

    function getUserpoints(){
        io.sockets.emit('userPoints', {userid, pointsScored});     //data = {userid, pointsScored}
    }
}

// module.exports = handleLeaderboard;