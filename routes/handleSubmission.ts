import { submissionData, submissionResponse } from '../models/socketInterfaces';
import * as mongoose from 'mongoose';
import * as challenges from '../models/challenge';
import {connect, mongo_uri} from '../server'


export let handleSubmission = function(data:any) {
  return () => {
        console.log(data);
        async () => {
            await connect.then(db => {
                console.log("Connected to server");
                let x = challenges.default.findOne({'qid': data.qid})
                console.log(x);
            })
        }    
    };
};

