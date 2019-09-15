import { Router } from "express";
import { User } from "../models/user";
import { Challenge, challengeInterface } from "../models/challenge";
import { submissionData } from "../models/socketInterfaces";
import Leaderboard from "../models/leaderboard";
import attemptedChallenges from "../models/solvedChallenges";

const router = Router();
export default router;

router.get("/", (req, res) => {
	res.render("home.hbs");
});

router.get("/allQuestions", (req, res) => {

});

router.get("/question", async (req, res) => {
	const qname = req.body.qname;

	if(!qname) {
		res.status(404).json({
			success: false,
			message: "Gimme question name"
		})
		return;
	}

	const quest = await Challenge.findOne({ name: qname });

	if (!quest) {
		res.status(404).json({
			success: false,
			message: "Cannot find Question"
		});
		return;
	}

	res.json({
		success: true,
		message: {
			qname: quest.name,
			description: quest.description,
			hint: quest.hint,
			startPoints: quest.startPoints,
			currentPoints: quest.currentPoints,
			solvedBy: quest.solvedBy
		}
	});

	res.render("questionPopUp.hbs");
});

router.post("/submit", async (req, res) => {
	const data: submissionData = req.body.submitData;

	const question = await Challenge.findOne({ _id: data.qid });

	if (data.ctfFlag == question.answer) {0
		const solved: boolean = true;
		await updateLog(data, question, solved);
		await refreshData(data, question);
		return "Correct Flag";
	} else {
		const solved: boolean = false;
		updateLog(data, question, solved);
		return "Incorrect Flag";
	}

	async function refreshData(
		data: submissionData,
		question: challengeInterface
	) {
		return async () => {
			var newPoints = Math.floor(question.currentPoints * (9 / 11));

			//Changes in the challenge Model--> change currentPoints and solvedBy
			await Challenge.updateOne(
				{ _id: data.qid },
				{
					$set: {
						currentPoints: newPoints,
						$push: { solvedBy: data.username }
					}
				},
				err => {
					console.log(err);
					res.status(400).json({
						success: false,
						message: "Challenge points update failed 1"
					});
				}
			);

			//Changes in the user Model--> changed solved and points
			await User.updateOne(
				{ _id: data.qid },
				{
					$set: {
						$inc: { points: newPoints },
						$push: { solved: data.username }
					}
				},
				err => {
					console.log(err);
					res.status(400).json({
						success: false,
						message: "User points update failed!"
					});
				}
			);

			await UpdateLeaderboardModel(data, newPoints);
		};
	}

	async function UpdateLeaderboardModel(
		data: submissionData,
		newPoints: number
	) {
		//Changes in leaderboard Model--> change username and points
		await Leaderboard.updateOne(
			{ username: data.username },
			{ $set: { $inc: { points: newPoints } } },
			err => {
				res.status(400).json({
					success: false,
					message: "Leaderboard update Failed!"
				});
				console.log(err);
			}
		);
	}

	async function updateLog(
		data: submissionData,
		question: challengeInterface,
		solved: boolean
	) {
		//Add log of attempted Question
		const pointsOnAttempt = solved ? question.currentPoints : 0;

		const newAttempt = new attemptedChallenges({
			questionId: data.qid,
			participant: data.username,
			timeSubmitted: Date(),
			pointsOnSubmission: pointsOnAttempt
		});

		await newAttempt.save((err, doc) => {
			if (!doc) {
				res.status(400).json({
					success: false,
					message: "Submission not saved in logs"
				});
			}
			if (err) {
				console.log(err);
			}
		});
	}
});

router.get("/leaderboard", async (req, res) => {
});

router.get("/questList", (req, res) => {

});


