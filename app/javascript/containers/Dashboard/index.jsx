import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GameChannel, UserChannel } from 'services/channels'
import Button from 'components/Button'
import {
  Wrapper,
  ButtonContainer,
  RoomCodeInput,
  JoinGameForm
} from './Styles'

class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      gamecode: ''
    }
  }

  onInputChange = (e) => {
    this.setState({
      gamecode: e.target.value
    })
  }

  onInputKeyDown = (e) => {
    if (e.key === 'Enter') this.joinGame()
  }

  joinGame = () => {
    this.props.joinGame(this.state.gamecode)
  }

  render() {
    return (
      <Wrapper>
        <ButtonContainer>
          <JoinGameForm>
            <RoomCodeInput id="game-code-input" placeholder="Game Code" onChange={this.onInputChange} onKeyDown={this.onInputKeyDown} />
            <Button text="join" onClick={this.joinGame} />
          </JoinGameForm>
          <Button text="create new game" onClick={this.props.createGame} />
        </ButtonContainer>
      </Wrapper>
    )
  }
}

Dashboard.defaultProps = {
}

Dashboard.propTypes = {
  createGame: PropTypes.func.isRequired,
  joinGame: PropTypes.func.isRequired
}

export const mapDispatchToProps = () => ({
  createGame: UserChannel.createGame,
  joinGame: (gameCode) => {
    GameChannel.joinGameChannel(gameCode)
    UserChannel.joinGame(gameCode)
  }
})

const mapStateToProps = (state) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
