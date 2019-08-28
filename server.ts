import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as session from 'express-session';
import passport from 'passport';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

require('dotenv').config();
mongoose.connect(process.env.MONGOURI);
app.use(session({secret: process.env.SECRET_KEY, saveUninitialized: true, resave: true}));

// port
var port = process.env.PORT || 8080;
app.listen(port);
console.log('localhost:' + port + ' - be there');
