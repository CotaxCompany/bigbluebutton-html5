import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import MeetingExitService from '../service';
import MeetingExitButtonComponent from './component';

const meetingExitButtonContainer = props => <MeetingExitButtonComponent {...props} />;

export default withTracker(() => {
  const { connected } = Meteor.status();

  return {
    connected,
    stats: MeetingExitService.getStats(),
  };
})(meetingExitButtonContainer);
