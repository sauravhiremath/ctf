import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface feedbackInterface extends mongoose.Document {
    username: string,
    feedback: string,
    finished: boolean
    // againCTF: boolean
}

const feedbackSchema = new Schema(
    {
      username: { type: String, required: true, unique: true },
      feedback: { type: String, required: true },
      finished: { type: Boolean, required: true}
    //   againCTF: { type: Boolean, required: true}
    },
);

export const feedback = mongoose.model<feedbackInterface>("feedback", feedbackSchema);
export default feedback;