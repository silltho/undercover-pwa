import React from 'react'
import PropTypes from 'prop-types'
import { Map, List } from 'immutable'
import Header from 'components/Header'
import Content from 'components/Content'
import Footer from 'components/Footer'
import Button from 'components/Button'
import VictimsItem from './VictimItem'

class TargetSelection extends React.PureComponent {
  render() {
    const {
      onRequestHide,
      onSelectTarget,
      victims,
      player,
      currentTarget
    } = this.props

    const renderedVictims = victims
      .filter((victim) => victim.get('id') !== player.get('id'))
      .map((victim) => (
        <VictimsItem
          key={`victim-${victim.get('id')}`}
          victim={victim}
          useSkill={onSelectTarget}
          isTarget={victim.get('id') === currentTarget.get('id')}
        />
      ))

    return (
      <React.Fragment>
        <Header>
          Who do you want to {player.getIn(['role', 'active'])}
        </Header>
        <Content>
          {renderedVictims}
        </Content>
        <Footer>
          <Button onClick={onRequestHide} text="Back" />
        </Footer>
      </React.Fragment>
    )
  }
}

TargetSelection.defaultProps = {
  currentTarget: Map()
}

TargetSelection.propTypes = {
  player: PropTypes.instanceOf(Map).isRequired,
  victims: PropTypes.instanceOf(List).isRequired,
  onSelectTarget: PropTypes.func.isRequired,
  onRequestHide: PropTypes.func.isRequired,
  currentTarget: PropTypes.instanceOf(Map)
}

export default TargetSelection