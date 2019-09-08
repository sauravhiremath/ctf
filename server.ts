import express from "express";
import hbs from 'express-handlebars';
import logger from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import socketio from "socket.io";
import http from "http";
import { submissionData, submissionResponse } from './models/socketInterfaces';
import { handleSubmission  as handleSubmission } from './routes/handleSubmission';
import authRoutes from './routes/auth';

const app = express();
// const hbs = require('express-handlebars');


const port = process.env.PORT || 4000;
const server = new http.Server(app);

const io = socketio(server);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// const server = app.listen(4000);
export const mongo_uri = "mongodb://localhost:27017/ctf"
export const connect = mongoose.connect(mongo_uri, { useMongoClient: true });

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs({
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("dotenv").config();
app.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: true
  })
);

app.use('/auth', authRoutes);
app.use('/', (req, res) => {
  res.redirect("/auth/register");
});

io.on("connection", socket => {

  console.log("Made connection to socketID and ipAddress ", [
    socket.id,
    socket.request.connection._peername.address
  ]);

  // socket.on('login', handleLogin)
  socket.on("userSubmission", handleSubmission);
  // socket.on('userPoints', handleLeaderbaord(this.data));
  // socket.on('help', handleHelper)

  socket.on('disconnect', () => {
    console.log("Removing user lock with socketid ", socket.id);
    //Remove the user Lock with the socketid here
  })
});
