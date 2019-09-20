var baby = [{
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
		description: "What happens if we use 100% of our brain!<br><br>Server: nc ctf-xp.csivit.com 2001",
		type: "Miscellaneous",
		difficulty: "baby",
		hint: "",
		answer: "CSICTF{Im_N0t_Th4t_Dum8_Aft3r4ll}",
		startPoints: 70,
		currentPoints: 70,
		solvedBy: [],
		hidden: false
	},
	{
		name: "Windows Registry Editor",
		description: `I was hungry so I made alphabet soup.<br><br>Get the file <a href="https://ctf.csivit.com/challenges/programming.zip">here</a>.`,
		difficulty: "hard",
		type: "Reverse Engineering",
		hint: null,
		answer: "CSICTF{NOWYOUKNOWNODEJSBOI}",
		startPoints: 200,
		currentPoints: 200,
		solvedBy: [],
		hidden: false
	},
	{
		name: "MS Word",
		description: "I choose to have faith, because without that, I have nothing… It’s the only thing that’s keeping me going.<br><br>Server: nc ctf-xp.csivit.com 2003",
		difficulty: "hard",
		type: "Jail",
		hint: null,
		answer: "CSICTF{Y0u_c4N_J41l_4_rev0luT10nary_buT_N0T_th3_r3V0lUT10n}",
		startPoints: 200,
		currentPoints: 200,
		solvedBy: [],
		hidden: false
	}
]
import {
	Challenge
} from "../models/challenge";
import io from "socket.io-client";

export function createQuestion(i) {
	Challenge.findOne({
		type: baby[i].type,
		difficulty: baby[i].difficulty,
		answer: baby[i].answer
	}, (err, doc) => {
		if (err) {
			console.log(err);
			return;
		} else {
			if (doc) {
				Challenge.findOneAndUpdate({
					type: doc.type,
					difficulty: doc.difficulty,
					answer: doc.answer
				}, {
					name: baby[i].name,
					description: baby[i].description,
					type: baby[i].type,
					difficulty: baby[i].difficulty,
					hint: baby[i].hint,
					answer: baby[i].answer,
					startPoints: baby[i].startPoints,
					currentPoints: baby[i].currentPoints,
					solvedBy: baby[i].solvedBy,
					hidden: baby[i].hidden,
				}, (err, doc2) => {
					if (err) console.log(err)
					else console.log("updated")
				})
			} else {
				let question = new Challenge(baby[i]);

				question.save(function (err, question) {
					if (err) return console.log(err);
					console.log(`Question ${i} saved`);
				});
			}
		}
	});

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
