import React from 'react'
import GameStart from 'components/GameStart'

const gameStates = {
  start: 'start',
  info: 'info',
  exchange: 'exchange',
  activity: 'activity'
}

const players = [
  {
    id: 1,
    nickname: 'nickName1'
  },
  {
    id: 2,
    nickname: 'nickName2',
    username: 'Thomas Siller',
    role: 'Enforcer'
  },
  {
    id: 3,
    nickname: 'nickName3'
  },
  {
    id: 4,
    nickname: 'nickName4'
  },
  {
    id: 5,
    nickname: 'nickName5'
  }
]
const currentUser = {
  nickname: 'John Doe',
  role: 'Godfather'
}

class Game extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      gamestate: gameStates.start
    }
  }

  startGame = () => {
    this.setState({
      gamestate: gameStates.info
    })
  }

  renderGamestate = () => {
    switch (this.state.gamestate) {
	    case gameStates.start:
		    return (
          <GameStart
            currentUser={currentUser}
            players={players}
            startGame={this.startGame}
          />
		    )
	    case gameStates.info:
		    return (
          <div>info</div>
		    )
      default:
        return (<div>default</div>)
    }
  }

  render() {
    return this.renderGamestate()
  }
}

export default Game
