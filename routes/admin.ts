import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render("adminLogin.hbs");
});

router.post("/", (req, res) => {
    //Login for admin
});

router.post("/addQuestion", (req, res) => {

});

router.post("editQuestion", (req, res) => {

});