import { Router } from "express";
import {
    User,
    validateEmail,
    validateName,
    validatePassword,
    validatePhoneNo,
    validateRegNo
} from "../models/user";
import { hash } from 'bcrypt';

const router = Router();

router.get("/register", async (req, res) => {
    if (
        !req.body.name ||
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
        name: req.body.name,
        regNo: req.body.regNo,
        password: await hash(req.body.password, process.env.SALT_ROUNDS),
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
