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
import { hash } from 'bcrypt';

const router = Router();

router.post("/register", async (req, res) => {
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
            message: "Invalid data field"
        });
        return;
    }

    const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        regNo: req.body.regNo,
        password: await hash(req.body.password, parseInt(process.env.SALT_ROUNDS)),
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        solved: []
    });

    await newUser.save();

    res.json({
        success: true
    });

    sendInviteEmail(req.body.email);

});


function sendInviteEmail(email: string) {
    // To be implemented
    return;
}


export default router;
