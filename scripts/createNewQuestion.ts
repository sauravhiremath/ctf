import { Challenge } from "../models/challenge";
import io from "socket.io-client";

export function createQuestion() {
	for (var i = 0; i < 10; i++) {
		let question = new Challenge({
			name: `Test${i}`,
			description: `Something00${i}`,
			type: "web",
			difficulty: "easy",
			hint: `Lol its Test ${i}`,
			answer: `aaa${i}`,
			startPoints: 100 + i,
			currentPoints: 55,
			solved: ["abc", "xyz"],
			hidden: false
		});

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
