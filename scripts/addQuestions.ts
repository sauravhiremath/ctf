var baby = [
    {
        name: "Mic-Check",
        description: "Go to https://csivit.com and find the flag!",
        type: "Miscellaneous",
        difficulty: "baby",
        hint: "",
        answer: "CSICTF{Th1s_1s_wh4t_A_fl4g_L0oKs_L1K3}",
        startPoints: 55,
        currentPoints: 55,
        solvedBy: [],
        hidden: false
    },
    {
        name: "Gambler",
        description: "What happens if we use 100% of our brain!",
        type: "Miscellaneous",
        difficulty: "baby",
        hint: "",
        answer: "CSICTF{Im_N0t_Th4t_Dum8_Aft3r4ll}",
        startPoints: 70,
        currentPoints: 70,
        solvedBy: [],
        hidden: false
    }
]
import { Challenge } from "../models/challenge";
import io from "socket.io-client";

export function createQuestion() {
	for (var i = 0; i < baby.length; i++) {
		let question = new Challenge(baby[i]);

		question.save(function(err, question) {
			if (err) return console.log(err);
			console.log(`${i} Question` + " is saved");
		});
	}
}

// const socket = io.connect('http://localhost:8080', {reconnect: true});

// // Add a connect listener
// socket.on('connect', function (socket) {
//     console.log('Connected!');
// });

// // const mess = {
// //   userid: "saurav",
// //   qid: string,
// //   ctfFlag: string,
// //   timeStampUser: string
// // };

// socket.emit("userSubmission", );
