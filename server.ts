import express from "express";
import hbs from "express-handlebars";
import logger from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import socketio from "socket.io";
import http from "http";
import homeRoutes from "./routes/home";
import authRoutes from "./routes/auth";
import Feedback from "./models/feedback";
import Leaderboard from "./models/leaderboard";
import { createQuestion } from "./scripts/addQuestions";
import disp from "./scripts/lbMigrate";
import { checkUserExists2 } from "./db/user";
var MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

const app = express();

const port = process.env.PORT || 4000;
const server = new http.Server(app);

const io = socketio(server);
server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

export const mongo_uri = "mongodb://localhost:27017/ctf";
export const connect = mongoose.connect(mongo_uri, { useMongoClient: true });

app.use("/static", express.static("static"));
// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine(
	"hbs",
	hbs({
		extname: "hbs",
		layoutsDir: __dirname + "/views",
		partialsDir: __dirname + "/views/partials"
	})
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	session({
		secret: process.env.SECRET_KEY,
		saveUninitialized: true,
		resave: true,
		store: new MongoDBStore({
			uri: "mongodb://localhost:27017/ctf",
			collection: "mySessions"
		})
	})
);


app.get("/feedback", (req, res) => {
	res.render("ctfend");
});



app.post("/feedback", async (req, res) => {
	const username = req.body.username.toString().trim();
	const feedback = req.body.feedback.toString().trim();
	if(!username || !feedback){
		res.json({
			success: false,
			message: "Kindly enter all values. :D"
		});
		return;
	};

	const chk = await checkUserExists2(username);
	console.log(chk)
	if ( chk === null) {
		res.json({
			success: false,
			message: "Already filled, or not registered"
		});
		return;
	};

	if(feedback > 2000) {
		res.json({
			success: false,
			message: "Too large message"
		});
		return;
	};

	const user = new Feedback({
		username: username,
		feedback: feedback,
		finished: true,
	});

	await user.save();
	res.json({
		success: true,
		message: "thenks"
	});
	// res.render("thankYou.hbs");
});


// app.use("*", (req, res) => {
// 	res.redirect("feedback");
// });
app.use("/home", homeRoutes);
app.use("/auth", authRoutes);
app.use("/", (req, res) => {
	res.redirect("/home");
});
app.use("*", (req, res) => {
	res.render("bsod404.hbs");
});