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
import { checkUserExists } from "../db/user";
import request from "request-promise";
import sgMail from "@sendgrid/mail";
import hbsexp from "express-handlebars";

const hbs = hbsexp.create();

const router = Router();
export default router;

router.post("/login", async (req, res, next) => {
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

	const username = req.body.username.toString().trim();
	const password = req.body.password.toString().trim();
    console.log(password);
	if (!username || !password) {
		res.status(400).json({
			success: false,
			message: "missingFields"
		});
		return;
	}

	await User.findOne({ username }, (err, doc0) => {
		if (!doc0) {
			res.status(400).json({
				success: false,
				message: "Not registered"
			});
		} else {
			User.findOne(
				{ username: username, verifiedStatus: true },
				(err, doc1) => {
					if (!doc1) {
						res.json({
							success: false,
							message: "Account Not verified"
						});
					} else {
						const chkPass = bcrypt.compareSync(
                            password,
                            doc1.password
                        );
                        
						if (chkPass == true) {
							req.session.user = username;
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
	res.render(`success.hbs`);
});

// router.get("/resetPassword", (req, res) => {
//     const email = req.body.email.toString();
//     if(!email) {

//     }
//     if (email.length <= 256) {
//         User.findOne({
//             email: email
//         }, function (err, doc) {
//             if (err) {
//                 res.render("/auth/resetPassword", {
//                     'message': "Please try again"
//                 });
//             } else {
//                 if (!doc) {
//                     res.render("register/resetPassword", {
//                         'message': `Looks like you haven't registered yet or you have entered a wrong email. Register <a href="/auth/register">here</a>.`
//                     });
//                     return;
//                 }
//                 if (doc.token == undefined) {
//                     const token: string = crypto.randomBytes(10).toString('hex');
//                     Register.findOneAndUpdate({
//                         email: email
//                     }, {
//                         flag: flag
//                     }, (err, doc) => {
//                         if (!doc) {
//                             console.log("here");
//                             res.render("register/resetPassword", {
//                                 'message': "Your email is not registered. Register <a href='riddler.csivit.com'>here</a>."
//                             });
//                         } else {
//                             sendLink(doc.fullName.toString(), doc.email.toString(), flag, function (err) {
//                                 if (err) {
//                                     console.log(err);
//                                     res.render("register/resetPassword", {
//                                         'message': "There was an error in sending the email, please refresh the page and try again."
//                                     });
//                                 } else {
//                                     res.render("register/resetPassword", {
//                                         'message': `Hey ${doc.fullName}!<br>We have sent you a mail ${doc.email}, please check your email and follow the instructions to reset your password.`
//                                     });
//                                 }
//                             });
//                         }
//                     });
//                 } else {
//                     res.render("register/resetPassword", {
//                         message: `We've already sent you a mail at ${doc1.email}. Please check your email. Contact <a href="https://www.facebook.com/csivitu" color="#473D99">us</a> on the listed channels if you have further issues.`
//                     })
//                 }

//             }
//         });
//     } else {
//         res.send("Too large");
//     }
// });

// router.post("/resetPassword", (req, res) => {
// //Get email registered or username
// });

// router.get("/resetToken/:?token", (req, res) => {

// });

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
	const vLink = `https://ctf.csivit.com/auth/verify?token=${randomToken}`;
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
