import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import MeetingExit from '/imports/api/meeting-exit';
import AuthTokenValidation, { ValidationStates } from '/imports/api/auth-token-validation';
import Users from '/imports/api/users';
import { publicationSafeGuard } from '/imports/api/common/server/helpers';

const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;

async function meetingExit() {
  const tokenValidation = await AuthTokenValidation
    .findOneAsync({ connectionId: this.connection.id });

  if (!tokenValidation || tokenValidation.validationStatus !== ValidationStates.VALIDATED) {
    Logger.warn(`Publishing MeetingExit was requested by unauth connection ${this.connection.id}`);
    return MeetingExit.find({ meetingId: '' });
  }

  const { meetingId, userId } = tokenValidation;

  check(meetingId, String);
  check(userId, String);

  const fields = {
    meetingId: 1,
    userId: 1,
    status: 1,
    statusUpdatedAt: 1,
    clientNotResponding: 1,
  };

  const User = await Users.findOneAsync({ userId, meetingId }, { fields: { role: 1 } });
  Logger.info(`Publishing connection status for ${meetingId} ${userId}`);

  if (!!User && User.role === ROLE_MODERATOR) {
    // Monitor this publication and stop it when user is not a moderator anymore
    const comparisonFunc = async () => {
      const user = await Users
        .findOneAsync({ userId, meetingId }, { fields: { role: 1, userId: 1 } });
      const condition = user.role === ROLE_MODERATOR;

      if (!condition) {
        Logger.info(`conditions aren't filled anymore in publication ${this._name}: 
        user.role === ROLE_MODERATOR :${condition}, user.role: ${user.role} ROLE_MODERATOR: ${ROLE_MODERATOR}`);
      }

      return condition;
    };
    publicationSafeGuard(comparisonFunc, this);
    return MeetingExit.find({ meetingId }, { fields });
  }

  return MeetingExit.find({ meetingId, userId }, { fields });
}

function publish(...args) {
  const boundNote = meetingExit.bind(this);
  return boundNote(...args);
}

Meteor.publish('meeting-exit', publish);