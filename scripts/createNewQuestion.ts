import { Challenge } from "../models/challenge";

let question = new Challenge({
  index: 0,
  name: "Test0",
  description: "Something00",
  hint: "Lol its Test",
  answer: "CTF{testAnswer}",
  startPoints: 100,
  solved: [],
  hidden: false
});

question.save(function(err, question) {
  if (err) return console.log(err);
  console.log(question + " is saved");
});
