import { submissionData, submissionResponse } from "../models/socketInterfaces";
import * as mongoose from "mongoose";
require("../models/challenge");

var challenges = mongoose.model("Challenge");
// const leaderboard = require('Leaderboard')
// const user = require('User')
// const solvedChallenges = require('solvedChallenges')

export async function handleSubmission(data: any) {
  console.log(data);
  let x = async () => {
    let y = await challenges.findOne({ qid: data.qid }).exec;
    return y;
  };

  x().then(function(res){
      console.log(res)
  })
}
