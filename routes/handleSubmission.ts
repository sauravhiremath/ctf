import { submissionData, submissionResponse } from "../models/socketInterfaces";
import * as mongoose from "mongoose";
import { Challenge } from "../models/challenge";

export async function handleSubmission(data: submissionData) {
    console.log(data);
    const question = await Challenge.findOne({ _id: data.qid });

    if (data.ctfFlag == question.id["answer"] && verifiedSubmission()) {
        refreshLeaderboard(data);
        return "Correct Flag";
    } else {
        return "Incorrect Flag";
    }

    console.log(question);
}

function verifiedSubmission(): boolean {
    return true;
}

function refreshLeaderboard(data: submissionData){
  let submissionPoints = () => {
    //Changes in the challenge Model        --> change currentPoints and solvedBy
    //               solvedChallenges Model --> Add new row with all new values
    //               user Model             --> changed solved and points

    //Update Question Points with new one
    //Return the previous points value
  };

  function UpdateLeaderboardModel(){
    //Changes in leaderboard Model          --> change username and points
    //Decide a final way to re-Sort Leaderboard, do (on client side) or (on server Side using redis)
  };
}