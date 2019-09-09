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
import * as crypto from "crypto";
import { checkUserExists } from "../db/user";
import request from "request-promise";
import sgMail from "@sendgrid/mail";
import hbsexp from 'express-handlebars';

const hbs = hbsexp.create();
const router = Router();
const randomToken = crypto.randomBytes(64).toString('hex');
var fullName: string;

router.get("/register", async (req, res) => {
    res.render("register.hbs");
});

router.post("/register", async (req, res) => {
    const captcha = req.body['g-recaptcha-response'];
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify";
    const gRes = await request.post(verificationURL, {
        form: {
            "secret":process.env.GOOGLE_RECAPTCHA_SECRET,
            "response": captcha
        }
    });

    if (gRes.success === false) {
        res.json({
            success: false,
            message: "recaptchaFailed"
        });
        return;
    }
    if (
        !req.body.name ||
        !req.body.username ||
        !req.body.regNo ||
        !req.body.password ||
        !req.body.email ||
        !req.body.phoneNo
    ) {
        res.status(400).json({
            success: false
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

    if (await checkUserExists(req.body.username, req.body.email, req.body.regNo)) {
        res.status(400).json({
            success: false,
            message: "duplicateUser"
        });
        return;
    }
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
        verifiedStatus: false
    });

    await newUser.save();

    res.json({
        success: true
    });

    fullName = req.body.name;

    sendInviteEmail(req.body.email);
});

router.get("verify", async (req, res) => {
    const token = req.query.token;

    const user = await User.findOne({ token });

    user["verifiedStatus"] = true;

    await user.save();
    res.render("verified", {email: user["email"]});
});

async function sendInviteEmail(email: string) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const link = `https://ctf.csivit.com/auth/verify?token=${randomToken}`
    const msg = {
        to: email,
        from: "ctf@csivit.com",
        subject: "Verify your CSI-CTF Account",
        text: `Verification Link: ${link}`,
        html: await hbs.render("views/verificationMail.hbs", {name: fullName, vLink: link})
    };
    sgMail.send(msg);
    return;
}

export default router;
