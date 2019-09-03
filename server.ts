import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as session from 'express-session';
import * as socket from 'socket.io';  
import passport from 'passport';

const app = express();
const port = process.env.PORT || 8080;
const server = app.listen(8080, function(){
    console.log('localhost:' + port + ' - be there');
});

export const io = socket(server);
import {handleLeaderboard as handleLeaderbaord} from  './routes/handleLeaderboard';
// const handleLeaderboard = handleLeaderbaord();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

require('dotenv').config();
mongoose.connect(process.env.MONGOURI, {useMongoClient: true});
app.use(session({secret: process.env.SECRET_KEY, saveUninitialized: true, resave: true}));


io.on('connection', function(socket){

    const add  = socket.handshake.address;

    console.log("Made connection to socketID {0} and ipAddress {1}", [socket.id, socket.request.connection._peername.address]);

    // socket.on('register', handleRegister)
    // socket.on('login', handleLogin)
    // socket.on('submission', handleSubmission)
    socket.on('leaderboard', handleLeaderbaord());
    // socket.on('help', handleHelper)
    
})
