import { Challenge } from "../models/challenge";
import io from "socket.io-client";

for(var i=0; i<10; i++){

  let question = new Challenge({
    index: i,
    name: `Test${i}`,
    description: `Something00${i}`,
    hint: `Lol its Test ${i}`,
    answer: `aaa${i}`,
    startPoints: 100 + i,
    solved: [],
    hidden: false
  });

  question.save(function(err, question) {
    if (err) return console.log(err);
    console.log(`${i} Question` + " is saved");
  });

}

const socket = io.connect('http://localhost:8080', {reconnect: true});

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});

// const mess = {
//   userid: "saurav",
//   qid: string,
//   ctfFlag: string,
//   timeStampUser: string
// };

socket.emit("userSubmission", );




