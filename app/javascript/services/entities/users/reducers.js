import { fromJS } from 'immutable'
import {
  GET_USERINFO,
  CREATE_GAME,
  GET_OPEN_GAMES
} from './constants'

const initialState = fromJS({})

function usersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERINFO:
      console.log('Userinfo:', action.data)
      return state
        .set('currentUser', action.data)
    case CREATE_GAME:
      console.log('new Game:', action.data)
      return state.updateIn(['games'], (games) => games.push(action.data))
    case GET_OPEN_GAMES:
	    return state.set('games', fromJS(action.data.games))
    default:
      return state
  }
}

export default usersReducer
