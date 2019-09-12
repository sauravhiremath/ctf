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
export default router;

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
            message: "missingField",
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

    const randomToken = crypto.randomBytes(64).toString('hex');

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

    await newUser.save(() => {
        return res.redirect("/");
    });

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
        res.status(404).send("Invalid token, user not found");
        return;
    }
    user["verifiedStatus"] = true;

    await user.save();
    res.render(`success.hbs`);
});

async function sendInviteEmail(name: string, email: string, randomToken: string) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const vLink = `https://ctf.csivit.com/auth/verify?token=${randomToken}`
    const msg = {
        to: email,
        from: "ctf@csivit.com",
        subject: "Verify your CSI-CTF Account",
        text: `Verification Link: ${vLink}`,
        html: await hbs.render("views/verificationMail.hbs", {name, vLink})
    };
    sgMail.send(msg);
    return;
}
