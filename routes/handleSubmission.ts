import { submissionData } from "../models/socketInterfaces";
import * as mongoose from "mongoose";
import { Challenge } from "../models/challenge";
import { attemptedChallenges } from "../models/solvedChallenges";
import User from "../models/user";
import Leaderboard from "../models/leaderboard";

var solved: boolean;

export async function handleSubmission(data: submissionData) {
  console.log(data);
  const question = await Challenge.findOne({ _id: data.qid });

  if (data.ctfFlag == question.id["answer"] && verifiedSubmission()) {
    //TO-DO: Make sure updateLog is executed before refreshLeaderboard
    solved = true;
    await updateLog(data, question, solved);
    await refreshData(data, question);
    return "Correct Flag";
  } else {
    solved = false;
    updateLog(data, question, solved);
    return "Incorrect Flag";
  }
}

function verifiedSubmission(): boolean {
  return true;
}

async function refreshData(data: submissionData, question) {
  return async () => {
    var newPoints = Math.floor(question.id["currentPoints"] * (9 / 11));

    //Changes in the challenge Model--> change currentPoints and solvedBy
    await Challenge.updateOne(
      { _id: data.qid },
      {
        $set: {
          currentPoints: newPoints,
          $push: { solvedBy: data.userid }
        }
      }
    );

    //Changes in the user Model--> changed solved and points
    await User.updateOne(
      { _id: data.qid },
      {
        $set: {
          $inc: { points: newPoints },
          $push: { solved: data.userid }
        }
      }
    );
  };
}

async function UpdateLeaderboardModel(data: submissionData, newPoints: number) {
  //Changes in leaderboard Model          --> change username and points
  await Leaderboard.updateOne({username: data.userid},{ $set: { $inc: {points: newPoints} } })
  
}

async function updateLog(data, question, solved) {
  //Add log of attempted Question
  const pointsOnAttempt = solved ? question.currentPoints : 0;

  const newAttempt = new attemptedChallenges({
    questionId: data.qid,
    participant: data.userid,
    timeSubmitted: Date(),
    pointsOnSubmission: pointsOnAttempt
  });
  await newAttempt.save();
}
