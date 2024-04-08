import { Meteor } from 'meteor/meteor';

const collectionOptions = Meteor.isClient ? {
  connection: null,
} : {};

const MeetingExit = new Mongo.Collection('meeting-exit', collectionOptions);

if (Meteor.isServer) {
  MeetingExit.createIndexAsync({ meetingId: 1, userId: 1 });
}

export default MeetingExit;
