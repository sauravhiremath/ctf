import { Router } from "express";
import { User } from "../models/user";
import mongoose from "mongoose";
import { Challenge, challengeInterface } from "../models/challenge";
import { submissionData } from "../models/socketInterfaces";
import Leaderboard from "../models/leaderboard";
import attemptedChallenges from "../models/solvedChallenges";
import { filter, map } from "bluebird";

const ObjectId = mongoose.Types.ObjectId;
const router = Router();
export default router;

router.get("/", userCheck, (req, res, next) => {
	// Challenge.insertMany(Questions);
	// req.session.user = "test123";
	// res.render("successMail.hbs");
	res.render("home.hbs");
});

router.get("/startMenu", userCheck, async (req, res) => {
	const currUserData = await User.findById(
		{ _id: req.session.userID },
		{ points: 1, solved: 1, name: 1 }
	);
	// console.log(currUserData);
	res.json({
		userID: currUserData._id,
		fname: currUserData.name,
		solved: currUserData.solved,
		username: req.session.user,
		points: currUserData.points
	});
});

router.get("/questionStatus", userCheck, async (req, res) => {
	var sortKey = req.query.sortKey;
	const solved = req.query.solved;
	const user = req.session.user; //type || difficulty

	if (sortKey != "type" && sortKey != "difficulty") {
		res.status(400).json({
			success: false,
			message: "Wrong API call!"
		});
		return;
	}

	var query = {};
	query["type"] = 1;
	query["difficulty"] = 1;
	query["name"] = 1;

	// console.log(solved);

	// console.log(user);
	if (solved === "True") {
		const allChallenges = await Challenge.find({}, {answer: 0, hint: 0}, (err, doc) => {
			doc = doc.filter(challenge => {
				return (
					challenge.solvedBy
						.map(solvedUser => solvedUser.username)
						.indexOf(user) > -1
				);
			});
			// console.log(doc);
			if (err) {
				res.status(400).json({
					success: false,
					message: "Error finding list of Unsolved Questions!"
				});
				return;
			}
			res.json({ allChallenges: doc });
		});
	} else {
		const allChallenges = await Challenge.find({}, {answer: 0, hint: 0}, (err, doc) => {
			doc = doc.filter(challenge => {
				return (
					challenge.solvedBy
						.map(solvedUser => solvedUser.username)
						.indexOf(user) == -1
				);
			});
			if (err) {
				res.status(400).json({
					success: false,
					message: "Error finding list of solved Questions!"
				});
				return;
			}
			res.json({ allChallenges: doc });
		});
	}
});

router.get("/question", userCheck, async (req, res) => {
	const qid = req.query.qid;

	if (!qid) {
		res.status(404).json({
			success: false,
			message: "Gimme question name"
		});
		return;
	}

	const quest = await Challenge.findOne({ _id: qid });

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
			solvedBy: quest.solvedBy,
			type: quest.type
		}
	});
});

router.post("/submit", userCheck, async (req, res) => {
	const qid = req.body.qid;
	const ctfFlag: string = req.body.ctfFlag;
	if (ctfFlag.length > 256) {
		res.json({
			success: false,
			message: "Too long submission"
		});
		return;
	}
	const timeStampUser: string = req.body.timeStampUser;

	const data: submissionData = {
		qid: qid,
		ctfFlag: ctfFlag,
		timeStampUser: timeStampUser
	};

	// console.log(data);
	const question = await Challenge.findOne({ _id: data.qid });
	if (!question) {
		res.json({
			success: false,
			message: "No qid"
		});
		return;
	}
	// console.log(question.solvedBy);
	if (
		question.solvedBy
			.map(solvedUser => solvedUser.username)
			.indexOf(req.session.user) > -1
	) {
		res.json({
			success: false,
			message: "Stop spamming!. Question already solved by you"
		});
		return;
	}
	// console.log(question, data);
	if (data.ctfFlag == question.answer) {
		const solved: boolean = true;
		const success1: boolean = await updateLog(data, question, solved);
		const success2: boolean = await refreshData(data, question, req, res);
		if (success1 == true && success2 == true) {
			res.json({
				success: true,
				message: "Correct"
			});
			return;
		} else {
			res.json({
				success: false,
				message: "update failed"
			});
			return;
		}
	} else {
		const solved: boolean = false;
		await updateLog(data, question, solved);
		res.json({
			success: false,
			message: "Incorrect"
		});
		return;
	}

	async function refreshData(
		data: submissionData,
		question: challengeInterface,
		req,
		res
	) {
		const x = question.solvedBy.length;
		const b = question.startPoints / 2;
		const a = question.startPoints;
		const s = 15;

		const oldPoints = question.currentPoints;
		var newPoints = Math.floor(
			Math.max(((b - a) * x * x) / (s * s) + a, b)
		);
		// console.log(username);
		// console.log(newPoints, question.currentPoints);
		//Changes in the challenge Model--> change currentPoints and solvedBy

		const challengeUpdate = await Challenge.updateOne(
			{ _id: new ObjectId(data.qid) },
			{
				$set: {
					currentPoints: newPoints
				},
				$push: {
					solvedBy: {
						username: req.session.user,
						usertime: new Date()
							.toISOString()
							.replace(/T/, " ")
							.replace(/\..+/, "")
					}
				}
			}
		);

		if (!challengeUpdate) {
			// res.json({
			// 	success: false,
			// 	message: "Challenge points update failed 1"
			// });
			return false;
		}

		//Changes in the user Model--> changed solved and points
		const userUpdate = await User.updateOne(
			{ _id: new ObjectId(req.session.userID) },
			{
				$inc: { points: newPoints },
				$push: {
					solved: {
						qname: question.name,
						qtime: new Date()
							.toISOString()
							.replace(/T/, " ")
							.replace(/\..+/, "")
					}
				}
			}
		);
		console.log(userUpdate);
		if (!userUpdate) {
			// res.json({
			// 	success: false,
			// 	message: "User points update failed!"
			// });
			return false;
		}

		// const attemptedForUser: any = await attemptedChallenges.find({ questionId: new ObjectId(data.qid), points: { $gt: 0 } });
		// for (var i=0; i< attemptedForUser.length; i++) {
		// 	// const some: any = attemptedForUser;
		// 	const user = attemptedForUser[i].participant;
		// 	console.log(user);
		// 	const finalPoints = Math.floor(newPoints - attemptedForUser[i].pointsOnSubmission);
		// 	console.log(finalPoints);

		// 	const myUser = await User.findOne({_id: req.session.userID});
		// 	myUser.points = myUser.points + finalPoints;
		// 	await myUser.save();
		// }
		// const updateForAll = await User.updateMany({ solved: question.name }, { points: })

		const solvedUsers = question.solvedBy.map(solved => solved.username);
		const users = await User.find({ username: { $in: solvedUsers } });
		await Promise.all(
			users.map(user => {
				user.points += newPoints - oldPoints;
				return user.save();
			})
		);
		const updateLeaderboard: boolean = await UpdateLeaderboardModel(
			data,
			newPoints,
			req,
			res
		);
		if (!updateLeaderboard) {
			return false;
		}

		// res.json({
		// 	success: true,
		// 	message: "Correct"
		// });
		return true;
		// console.log("done");
	}

	async function UpdateLeaderboardModel(
		data: submissionData,
		newPoints: number,
		req,
		res
	) {
		// console.log(req.session.userID, newPoints);
		//Changes in leaderboard Model--> change username and points
		console.log(req.session.userID);
		const updateOrder = await Leaderboard.updateOne(
			{ username: req.session.user },
			{ $inc: { points: newPoints } }
		);

		// console.log(updateOrder);

		if (!updateOrder) {
			return false;
		}

		return true;
	}

	async function updateLog(
		data: submissionData,
		question: challengeInterface,
		solved: boolean
	) {
		//Add log of attempted Question
		const pointsOnAttempt = solved ? question.currentPoints : 0;

		const newAttempt = new attemptedChallenges({
			questionId: new ObjectId(data.qid),
			participant: req.session.userID,
			timeSubmitted: new Date()
				.toISOString()
				.replace(/T/, " ")
				.replace(/\..+/, ""),
			pointsOnSubmission: pointsOnAttempt
		});
		// console.log(newAttempt);
		await newAttempt.save((err, doc) => {
			if (!doc) {
				console.log(doc);
				return false;
			}
			if (err) {
				console.log(err);
				return false;
			}
		});

		return true;
	}
});

router.get("/leaderboard", async (req, res) => {
	let currStandings = await Leaderboard.find({}).sort({ points: 1 });

	let standings = await User.find({}, { username: 1, points: 1 }).sort({
		points: -1
	});

	if (!standings) {
		res.status(400).json({
			success: false,
			message: "Cannot find leaderboard this moment"
		});
		return;
	}
	// console.log(currStandings);
	// console.log(currStandings);
	res.json(standings);
});

function userCheck(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect("/auth/register");
		// next();
	}
}

const Questions = [
	{
		name: "Windows Media Player",
		description: "Enjoy this thing!",
		difficulty: "Medium",
		type: "Forensics",
		hint: null,
		answer: "CSICTF{aLAn_7UR1N'}",
		startPoints: 70,
		currentPoints: 70,
		solvedBy: [],
		hidden: false
	},
	// {
	// 	name: "Paint",
	// 	description: "Enjoy this thing!",
	// 	difficulty: "Easy",
	// 	type: "Forensics",
	// 	hint: null,
	// 	answer: String,
	// 	startPoints: Number,
	// 	currentPoints: Number,
	// 	solvedBy: Array,
	// 	hidden: { type: Boolean, required: false }
	// },
	{
		name: "Windows Registry Editor",
		description: "Enjoy this thing!",
		difficulty: "Hard",
		type: "Reverse Engineering",
		hint: null,
		answer: "CSICTF{NOWYOUKNOWNODEJSBOI}",
		startPoints: 100,
		currentPoints: 100,
		solvedBy: [],
		hidden: false
	},
	{
		name: "MS Word",
		description: "Enjoy this thing!",
		difficulty: "Hard",
		type: "Jail",
		hint: null,
		answer: "CSICTF{Y0u_c4N_J41l_4_rev0luT10nary_buT_N0T_th3_r3V0lUT10n}",
		startPoints: 100,
		currentPoints: 100,
		solvedBy: [],
		hidden: false
	}
];
