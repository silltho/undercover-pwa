import React from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'
import { ICONS, ACTIVE_ICONS } from 'components/IconFont'
import { getVideoByRole, getImageByRole } from 'config/roleImages'
import {
  BorderContainer,
  BorderContainerTitel,
  BorderContainerFooter,
  Content,
  Action
} from 'styles/components'
import PlayerStates from 'config/playerStates'

import {
  RoleVideoContainer,
  ActionIcon,
  ActionButton,
  Informations
} from './Styles'

class RoleOverview extends React.PureComponent {
  render() {
    const {
      player,
      showTargetSelection,
      showRoleInformation,
      skipPhase,
      showRoleCovert,
      currentTarget
    } = this.props

    const roleDetails = player.get('role')
    const pseudonym = player.get('codename')
    const state = player.get('state')

    const activeIcon = ACTIVE_ICONS[roleDetails.get('active')]
    const roleVideo = getVideoByRole(roleDetails.get('name'))
    const roleImage = getImageByRole(roleDetails.get('name'))

    return (
      <React.Fragment>
        <Content>
          <BorderContainer>
            <BorderContainerTitel onClick={skipPhase}>{roleDetails.get('name')}</BorderContainerTitel>
            <RoleVideoContainer dead={state !== PlayerStates.DEAD}>
              <video autoPlay muted loop="loop" poster={roleImage}>
                <source src={roleVideo} type="video/mp4" />
                <span>Your browser does not support the video tag.</span>
              </video>
            </RoleVideoContainer>
            <Informations>
              <div>Name: <span>{pseudonym}</span></div>
              <div>Next Target: <span>{currentTarget.has('codename') ? currentTarget.get('codename') : '-none-'}</span></div>
            </Informations>
            <BorderContainerFooter>
              <ActionIcon icon={ICONS.help2} onClick={showRoleInformation} />
              <Action onClick={showRoleCovert}>
                hide
              </Action>
              { state !== PlayerStates.ALIVE &&
                <ActionIcon icon={activeIcon} onClick={showTargetSelection}/>
              }
            </BorderContainerFooter>
          </BorderContainer>
        </Content>
      </React.Fragment>
    )
  }
}

RoleOverview.defaultProps = {
  currentTarget: Map()
}

RoleOverview.propTypes = {
  player: PropTypes.instanceOf(Map).isRequired,
  showTargetSelection: PropTypes.func.isRequired,
  showRoleInformation: PropTypes.func.isRequired,
  showRoleCovert: PropTypes.func.isRequired,
  skipPhase: PropTypes.func.isRequired,
  currentTarget: PropTypes.instanceOf(Map)
}

export default RoleOverview
