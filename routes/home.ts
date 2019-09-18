import { Router } from "express";
import { User } from "../models/user";
import { Challenge, challengeInterface } from "../models/challenge";
import { submissionData } from "../models/socketInterfaces";
import Leaderboard from "../models/leaderboard";
import attemptedChallenges from "../models/solvedChallenges";

const router = Router();
export default router;

router.get("/", (req, res, next) => {
	req.session.user = "sauravmh";
	req.session.userID = "5d7bd673f3025f486c70eee9";
	res.render("home.hbs");
});

router.get("/questionStatus?:sortKey", async (req, res) => {
	const sortKey = req.query.sortKey; //type || difficulty

	if (sortKey != "type" && sortKey != "difficulty") {
		res.status(400).json({
			success: false,
			message: "Wrong API call!"
		});
		return;
	}

	const otherType: string = sortKey == "type" ? "difficulty" : "type";
	var query = {};
	query[sortKey] = 1;
	query[otherType] = 1;
	query["name"] = 1;

	const allChallenges = await Challenge.find({}, query, err => {
		if (err) {
			res.status(400).json({
				success: false,
				message: "Error finding list of Questions!"
			});
		}
	}).sort({ [sortKey]: 1 });

	res.json({ allChallenges });
});

router.post("/question", async (req, res) => {
	const qname = req.body.qname;

	if (!qname) {
		res.status(404).json({
			success: false,
			message: "Gimme question name"
		});
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
			id: quest._id,
			qname: quest.name,
			description: quest.description,
			hint: quest.hint,
			startPoints: quest.startPoints,
			currentPoints: quest.currentPoints,
			solvedBy: quest.solvedBy
		}
	});
});

router.post("/submit", userCheck, async (req, res) => {
	const qid = req.body.qid;
	// console.log(qid);
	const ctfFlag: string = req.body.ctfFlag;
	const timeStampUser: string = req.body.timeStampUser;

	const data: submissionData = {
		qid: qid,
		ctfFlag: ctfFlag,
		timeStampUser: timeStampUser
	};

	// console.log(data);
	const question = await Challenge.findOne({ _id: data.qid });
	if (data.ctfFlag == question.answer) {
		const solved: boolean = true;
		// console.log("ps1");
		await updateLog(data, question, solved);
		await refreshData(data, question);
		res.json({
			success: true,
			message: "Correct"
		});
		return;
	} else {
		const solved: boolean = false;
		updateLog(data, question, solved);
		res.json({
			success: false,
			message: "Incorrect"
		});
		return;
	}

	async function refreshData(
		data: submissionData,
		question: challengeInterface
	) {
		var newPoints = Math.floor(question.currentPoints * (9 / 11));
		// console.log(newPoints, question.currentPoints);
		//Changes in the challenge Model--> change currentPoints and solvedBy
		await Challenge.updateOne(
			{ _id: data.qid },
			{
				$set: {
					currentPoints: newPoints,
					$push: { solvedBy: req.session.user }
				}
			},
			(err, doc) => {
				if (err) {
					// console.log(err);
					res.status(400).json({
						success: false,
						message: "Challenge points update failed 1"
					});
					return;
				}
				if (!doc) {
					res.status(400).json({
						success: false,
						message:
							"Challenge points update failed. Challenge qid not found!"
					});
					return;
				}
			}
		);

		// console.log(newPoints, question.currentPoints);

		//Changes in the user Model--> changed solved and points
		await User.updateOne(
			{ _id: data.qid },
			{
				$set: {
					$inc: { points: newPoints },
					$push: { solved: question.name }
				}
			},
			(err, doc) => {
				if (err) {
					// console.log(err);
					res.status(400).json({
						success: false,
						message: "User points update failed!"
					});
					return;
				}
				if (!doc) {
					res.status(400).json({
						success: false,
						message:
							"User points update failed. Question qid not found"
					});
					return;
				}
			}
		);

		// console.log("ps3");

		await UpdateLeaderboardModel(data, newPoints);
		// console.log("done");
	}

	async function UpdateLeaderboardModel(
		data: submissionData,
		newPoints: number
	) {
		//Changes in leaderboard Model--> change username and points
		await Leaderboard.updateOne(
			{ username: req.session.user },
			{ $set: { $inc: { points: newPoints } } },
			(err, doc) => {
				if (err) {
					console.log(err);
					res.status(400).json({
						success: false,
						message: "Leaderboard update Failed!"
					});
					return;
				}
				if (!doc) {
					res.status(400).json({
						success: false,
						message:
							"Leaderboard update Failed. username not found!"
					});
					return;
				}
			}
		).sort({ points: 1 });

		// console.log("Leaderboard update done");
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
			participant: req.session.userID,
			timeSubmitted: Date(),
			pointsOnSubmission: pointsOnAttempt
		});
		// console.log(newAttempt);
		await newAttempt.save((err, doc) => {
			if (!doc) {
				res.status(400).json({
					success: false,
					message: "Submission not saved in logs"
				});
				return;
			}
			if (err) {
				// console.log(err);
				res.status(400).json({
					success: false,
					message: "Submission not saved in logs"
				});
				return;
			}
		});
	}
});

router.get("/leaderboard", async (req, res) => {
	const currStandings = await Leaderboard.find({ points: { $gte: 0 } });
	// console.log(currStandings);
	res.json(currStandings);
});

function userCheck(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		// res.redirect("/auth/register");
		next();
	}
}
