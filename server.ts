import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as session from 'express-session';
import * as socketio from 'socket.io';  
import passport from 'passport';
import {handleLeaderboard as handleLeaderbaord} from  './routes/handleLeaderboard';

const app = express();
const port = process.env.PORT || 4000;
const server = app.listen(port, function(){
    console.log('localhost:' + port + ' - be there');
});
// const server = app.listen(4000);
export const io = socketio(server);


app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

require('dotenv').config();
mongoose.connect(process.env.MONGOURI, {useMongoClient: true});
app.use(session({secret: process.env.SECRET_KEY, saveUninitialized: true, resave: true}));


io.on('connection', (socket) => {

    // const add  = socket.handshake.address;

    console.log("Made connection to socketID {0} and ipAddress {1}", [socket.id, socket.request.connection._peername.address]);

    // socket.on('register', handleRegister)
    // socket.on('login', handleLogin)
    // socket.on('submission', handleSubmission)
    socket.on('leaderboard', handleLeaderbaord('test',50));
    // socket.on('help', handleHelper)
    
})
