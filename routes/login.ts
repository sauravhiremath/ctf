import { Router } from "express";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import { checkUserExists } from "../db/user";
import request from "request-promise";
import sgMail from "@sendgrid/mail";
import hbsexp from "express-handlebars";
import User from "../models/user";

const hbs = hbsexp.create();
const router = Router();
export default router;

const adminUser: string = "ctfrox";
const adminPass: string = "leaveatthetone";

router.get("/admin", async (req, res, next) => {
	if (req.session.admin) {
		next();
	} else {
		res.redirect("/auth/admin");
	}
});

router.post("/auth/admin", async (req, res) => {
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

	if (!username || !password) {
		res.status(400).json({
			success: false,
			message: "missingFields"
		});
		return;
	}

	if (username === adminUser && password === adminPass) {
		req.session.admin = true;
		res.redirect("/regCount");
	}
	{
		res.status(400).json({
			success: false,
			message: "invalidDetails"
		});
		return;
	}
});

router.get("/regCount", requiresLogin, async (req, res) => {
	const currCount = await User.count(
		{ verfiedStatus: true },
		(err, count) => {
            console.log("Error in .count() regCount")
            res.send("Error" + err);
		}
    );

    res.render("/admin/regCount", {
        regCount: currCount
    })

});

router.get("/logout", function(req, res, next) {
	req.session.destroy(function() {
		res.redirect("/");
	});
});

function requiresLogin(req, res, next) {
	if (req.session.admin) {
		return next();
	} else {
		res.status(400).json({
			success: false,
			message: "You must be logged in to view this page"
		});
	}
}
