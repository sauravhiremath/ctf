import { Timestamp } from 'bson';

export interface submissionData {
  userid: string,
  qid: string,
  ctfFlag: string,
  timeStampUser: string,
}

export interface submissionResponse extends submissionData {
  status: boolean,
  points ?: number,
  updatedPoints ?: number,
  TimestampServer: Timestamp,
}

export interface loginData {
  username: string,
  password: string //Hashed form, from client side
}

export interface renewConnectionData {
  socketId: string,
  authToken: string, //Generated per user, with combination of username and password (Hashed). Hence only one, unique login instance per user
  ipAddress: string,
  userAgent: Array<string>,
}