import { submissionData, submissionResponse } from "../models/socketInterfaces";
import * as mongoose from "mongoose";
import { Challenge } from "../models/challenge";

export async function handleSubmission(data: submissionData) {
  console.log(data);
  const question = await Challenge.findOne({ _id: data.qid });

  //   question.id["name"] = "dddd";
  if (data.ctfFlag == question.id["answer"]) {
    // await question.id[]
  }
  console.log(question);
}
