import React from 'react'
import { Map, List } from 'immutable'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  DashboardChannel,
  GameChannel
} from 'services/channels'
import { leaveGame } from 'services/actions'
import Button from 'components/Button'
import Footer from 'components/Footer'
import Title from 'components/Title'
import {
  Wrapper,
  PlayerCount
} from './Styles'

class Lobby extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    if (!nextProps.currentGame) {
      this.props.history.push('/')
    }
  }

  leaveGame = () => {
    this.props.leaveGame(this.props.currentGame.get('id'))
    this.props.history.push('/')
  }

  initializeGame = () => {
    this.props.initializeGame()
    this.props.history.push('/game')
  }

  render() {
    const { currentGame } = this.props

    return (
      <Wrapper>
        <Title title={currentGame && currentGame.get('title')} />
        <PlayerCount>
          {currentGame && currentGame.get('players').size} Player
        </PlayerCount>
        <Footer>
          <Button onClick={this.leaveGame} text="exit" />
          <Button onClick={this.initializeGame} text="start" />
        </Footer>
      </Wrapper>
    )
  }
}

Lobby.propTypes = {
  history: PropTypes.object.isRequired,
  currentGame: PropTypes.instanceOf(Map).isRequired,
  leaveGame: PropTypes.func.isRequired,
  initializeGame: PropTypes.func.isRequired
}

export const mapDispatchToProps = (dispatch) => ({
  leaveGame: (gameId) => {
    DashboardChannel.leaveGame(gameId)
    GameChannel.unsubscribe()
    dispatch(leaveGame())
  },
  initializeGame: GameChannel.initializeGame
})

const mapStateToProps = (state) => ({
  currentGame: state.getIn(['App', 'currentGame'], null)
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby))
