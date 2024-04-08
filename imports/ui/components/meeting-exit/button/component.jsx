import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import Button from '/imports/ui/components/common/button/component';
// import MeetingExitModalContainer from '/imports/ui/components/meeting-exit/modal/container';
import MeetingExitService from '/imports/ui/components/meeting-exit/service';
import Icon from '/imports/ui/components/meeting-exit/icon/component';
import Styled from './styles';
import { makeCall } from '/imports/ui/services/api';

const intlMessages = defineMessages({
  label: {
    id: '미팅 나가기',
    description: 'Meeting exit button label'
  },
  description: {
    id: 'app.meeting-exit.description',
    description: 'Meeting exit button description'
  }
});

class MeetingExitButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    }
    // Set the logout code to 680 because it's not a real code and can be matched on the other side
    this.LOGOUT_CODE = '680';

    this.leaveSession = this.leaveSession.bind(this);
  }

  renderIcon(level = 'normal') {
    return(
      <Styled.IconWrapper>
        <Icon
          level={level}
          grayscale
        />
      </Styled.IconWrapper>
    );
  }

  // setModalIsOpen = isOpen => this.setState({ isModalOpen: isOpen }); 

  // renderModal(isModalOpen) {
  //   return (
  //     isModalOpen ?
  //     <MeetingExitModalContainer
  //       {...{
  //         isModalOpen,
  //         setModalIsOpen: this.setModalIsOpen
  //       }}
  //     /> : null
  //   )
  // }

  leaveSession() {
    makeCall('userLeftMeeting');
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set('codeError', this.LOGOUT_CODE);
  }

  render() {
    const {
      intl,
      connected,
    } = this.props;
    const { isModalOpen } = this.state;

    if (!connected) {
      return (
        <Styled.ButtonWrapper>
          <Button
            customIcon={this.renderIcon()}
            label={intl.formatMessage(intlMessages.label)}
            hideLabel
            aria-label={intl.formatMessage(intlMessages.description)}
            size="sm"
            disabled
            ghost
            circle
            onClick={() => {}}
            data-test="meetingExitButton"
          />
          {/* {this.renderModal(isModalOpen)} */}
        </Styled.ButtonWrapper>
      );
    }

    const {
      stats,
    } = this.props;

    let color;
    switch (stats) {
      case 'warning':
        color = 'success';
        break;
      case 'danger':
        color = 'warning';
        MeetingExitService.notification('warning', intl);
        break;
      case 'critical':
        color = 'danger';
        MeetingExitService.notification('error', intl);
        break;
      default:
        color = 'success';
    }

    const currentStatus = stats ? stats : 'normal';

    return (
      <Styled.ButtonWrapper>
        <Button
          customIcon={this.renderIcon(currentStatus)}
          label={intl.formatMessage(intlMessages.label)}
          hideLabel
          aria-label={intl.formatMessage(intlMessages.description)}
          size="sm"
          color={color}
          circle
          onClick={() => this.leaveSession()}
          data-test="meetingExitButton"
        />
        {/* {this.renderModal(isModalOpen)} */}
      </Styled.ButtonWrapper>
    );
  }
}

export default injectIntl(MeetingExitButton);