import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { GameChannel } from 'services/channels'
import GameStart from 'components/GameStart'
import GameInfo from 'components/GameInfo'
import GameExchange from 'components/GameExchange'
import GameActivity from 'components/GameActivity'

const gamePhases = {
  waiting: 'waiting',
  info: 'inform',
  exchange: 'exchange',
  activity: 'activity',
  initialized: 'initialized'
}

class Game extends React.PureComponent {
  renderCurrentPhase = () => {
    switch (this.props.game.get('aasm_state')) {
      case gamePhases.initialized:
        return (
          <GameStart
            game={this.props.game}
            player={this.props.player}
            startGame={this.props.startGame}
          />
        )
      case gamePhases.info:
        return (
          <GameInfo
            round={this.props.game.get('round') || 0}
            roundInformation={this.props.roundInformation}
            readInfos={this.props.endInfoPhase}
          />
        )
      case gamePhases.exchange:
        return (
          <GameExchange
            endExchange={this.props.endExchangePhase}
          />
        )
      case gamePhases.activity:
        return (
          <GameActivity
            useSkill={this.props.useSkill}
            allSkillsUsed={this.props.allSkillsUsed}
            player={this.props.player}
            game={this.props.game}
          />
        )
      default:
        return (<div>game is in a unknown state</div>)
    }
  }

  render() {
    return this.renderCurrentPhase()
  }
}

Game.propTypes = {
  game: PropTypes.instanceOf(Map).isRequired,
  player: PropTypes.instanceOf(Map).isRequired,
  roundInformation: PropTypes.instanceOf(Map).isRequired,
  endExchangePhase: PropTypes.func.isRequired,
  endInfoPhase: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  useSkill: PropTypes.func.isRequired,
	allSkillsUsed: PropTypes.func.isRequired
}

export const mapDispatchToProps = () => ({
  endExchangePhase: GameChannel.endExchangePhase,
  endInfoPhase: GameChannel.endInfoPhase,
  startGame: GameChannel.startGame,
  useSkill: GameChannel.useSkill,
  allSkillsUsed: GameChannel.allSkillsUsed
})

const mapStateToProps = (state) => ({
  game: state.get('Game'),
  player: state.get('Player'),
  roundInformation: state.get('RoundInformation')
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)
