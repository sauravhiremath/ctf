import { Router } from "express";
import {
	User,
	validateEmail,
	validateName,
	validatePassword,
	validatePhoneNo,
	validateRegNo,
	validateUsername
} from "../models/user";
import { hash } from "bcrypt";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import mongoose from "mongoose";
import { checkUserExists } from "../db/user";
import request from "request-promise";
import sgMail from "@sendgrid/mail";
import hbsexp from "express-handlebars";
import Leaderboard from "../models/leaderboard";

const hbs = hbsexp.create();

const router = Router();
export default router;

const ObjectId = mongoose.Types.ObjectId;

router.post("/login", async (req, res, next) => {

	const username = req.body.username.toString().trim();
	const password = req.body.password.toString().trim();
	if (!username || !password) {
		res.status(400).json({
			success: false,
			message: "missingFields"
		});
		console.log(res);
		return;
	}

	await User.findOne({ username }, (err, doc0) => {
		if (!doc0) {
			res.json({
				success: false,
				message: `User with ${username} is not registered`
			});
		} else {
			User.findOne(
				{ username: username, verifiedStatus: true },
				(err, doc1) => {
					if(err){
						res.json({
							success: false,
							message: "Account Not Found"
						});
						return;
					}
					if (!doc1) {
						res.json({
							success: false,
							message: "Please verify your account first"
						});
						return;
					} else {
						const chkPass = bcrypt.compareSync(
							password,
							doc1.password
						);

						if (chkPass == true) {
							req.session.user = username;
							req.session.fname = doc1.name;
							req.session.userID = doc1._id;
							res.json({
								success: true,
								message: "Logged In"
							});
							return;
						} else {
							res.json({
								success: false,
								message: "Password Incorrect"
							});
						}
					}
				}
			);
		}
	});
});

router.get("/register", async (req, res) => {
	res.render("register.hbs");
});

router.post("/register", async (req, res) => {
	const captcha = req.body["g-recaptcha-response"];
	const verificationURL = "https://www.google.com/recaptcha/api/siteverify";
	const gRes = await request.post(verificationURL, {
		form: {
			secret: process.env.GOOGLE_RECAPTCHA_SECRET,
			response: captcha
		}
	});

	const recaptchaStatus = JSON.parse(gRes);
	if (recaptchaStatus.success === false) {
		res.json({
			success: false,
			message: "recaptchaFailed"
		});
		return;
	}

	if (
		!req.body.name ||
		!req.body.username ||
		!req.body.password ||
		!req.body.email ||
		!req.body.phoneNo
	) {
		res.status(400).json({
			success: false,
			message: "missingField"
		});
		return;
	}

	if (
		!validateEmail(req.body.email) ||
		!validateUsername(req.body.username) ||
		!validateName(req.body.name) ||
		!validatePassword(req.body.password) ||
		!validatePhoneNo(req.body.phoneNo) ||
		!validateRegNo(req.body.regNo)
	) {
		res.status(400).json({
			success: false,
			message: "invalidDetails"
		});
		return;
	}

	if (await checkUserExists(req.body.username, req.body.email)) {
		res.status(400).json({
			success: false,
			message: "duplicateUser"
		});
		return;
	}

	const randomToken = crypto.randomBytes(64).toString("hex");

	const newUser = new User({
		username: req.body.username,
		name: req.body.name,
		regNo: req.body.regNo,
		password: await hash(
			req.body.password,
			parseInt(process.env.SALT_ROUNDS)
		),
		email: req.body.email,
		phoneNo: req.body.phoneNo,
		solved: [],
		token: randomToken,
		verifiedStatus: false
	});

	await newUser.save();

	res.json({
		success: true
	});

	sendInviteEmail(req.body.name, req.body.email, randomToken);
});

router.get("/verify", async (req, res) => {
	const token = req.query.token;

	if (!token) {
		res.status(400).json({
			success: false
		});
		return;
	}
	const user = await User.findOne({ token });

	if (!user) {
		res.send("Invalid token, user not found");
		return;
	}
	user["verifiedStatus"] = true;

	await user.save();

	const leadderboardName = new Leaderboard({
		username: user.username,
		points: 0
	})
	await leadderboardName.save();

	res.render(`success.hbs`);
});
// router.get("/resetPassword", (req, res) => {
// 	res.render("/forgotPassword");
// });

router.post("/resetPassword", async (req, res) => {
	//Get email registered or username
	const email = req.body.email.toString().trim();

	if(!email) {
		res.json({
			success: false,
			message: "Enter Mail"
		});
		return;
	};

	const user = await User.findOne(
		{ email },
		{ name: 1, token: 1, verifiedStatus: 1, emailReSent: 1, email: 1 },
	);

	if(!user) {
		res.json({
			success: false,
			message: "Email not registered. Register again"
		});
		return;
	}

	if(user.emailReSent) {
		res.json({
			success: false,
			message: `Email already sent to ${user.email}. Wait for 5 min. Kindly check in spam`
		});
		return;
	};

	const randomToken = crypto.randomBytes(10).toString("hex");
	const userDetails = await User.findByIdAndUpdate({ _id: new ObjectId(user._id) }, { passToken: randomToken, emailReSent: true });
	
	// console.log(user.name, user.email, randomToken);

	sendPasswordEmail(user.name, user.email, randomToken);

	res.json({
		success: true,
		message: `Verification Mail has been sent to ${user.email}. Check Spam Folder too.`
	});
});

router.get("/updatePassword", async (req, res) => {
	const token = req.query.token;
	console.log(token);
	if (!token) {
		res.status(400).json({
			success: false,
			message: "Lol, what u doing here!"
		});
		return;
	}
	const user = await User.findOne({ passToken: token });

	if (!user) {
		res.send("Invalid token, user not found");
		return;
	}

	res.render("passwordReset.hbs", { name: user.name, token: token });
});

router.post("/updatePassword", async (req, res) => {
	const token = req.body.token;
	if(!req.body.password){
		res.json({
			success: false,
			message: "Enter password"
		});
		return;
	};
	const password = await hash(
		req.body.password,
		parseInt(process.env.SALT_ROUNDS)
	);

	const UserDetails = await User.findOneAndUpdate(
		{ passToken: token, emailReSent: true },
		{
			password: password,
			emailReSent: false
		}
	);
	
	if (!UserDetails) {
		res.json({
			success: false,
			message: "Password change failed!"
		});
		return;
	}
    
    res.json({
        success: true,
        message: `Password updated successfully. Click <a href='ctf.csivit.com'>here</a> to login`
    })
});

// router.get("/logout", function(req, res, next) {
// 	req.session.destroy(function() {
// 		res.redirect("/");
// 	});
// });

async function sendInviteEmail(
	name: string,
	email: string,
	randomToken: string
) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const vLink = `https://ctfdev.csivit.com/auth/verify?token=${randomToken}`;
	const msg = {
		to: email,
		from: {
			name: "CSI-CTF",
			email: "ctf@csivit.com"
		},
		subject: "Verify your CSI-CTF Account",
		text: `Verification Link: ${vLink}`,
		html: await hbs.render("views/verificationMail.hbs", { name, vLink }),
		replyTo: {
			email: "askcsivit@gmail.com",
			name: "CSI-VIT"
		}
	};
	sgMail.send(msg);
	return;
}

async function sendPasswordEmail(
	name: string,
	email: string,
	randomToken: string
) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const vLink = `https://ctf.csivit.com/auth/updatePassword?token=${randomToken}`;
	const msg = {
		to: email,
		from: {
			name: "CSI-CTF",
			email: "ctf@csivit.com"
		},
		subject: "Password Reset for CSI-CTF",
		text: `Password Reset Link: ${vLink}`,
		html: await hbs.render("views/passResetMail.hbs", { name, vLink }),
		replyTo: {
			email: "askcsivit@gmail.com",
			name: "CSI-VIT"
		}
	};
	sgMail.send(msg);
	return;
}
