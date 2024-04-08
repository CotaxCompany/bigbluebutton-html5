import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import MeetingExitService from '../service';
import MeetingExitIconComponent from './component';

const meetingExitIconContainer = props => <MeetingExitIconComponent {...props} />;

export default withTracker(() => {
  return {
    stats: MeetingExitService.getStats(),
  };
})(meetingExitIconContainer);