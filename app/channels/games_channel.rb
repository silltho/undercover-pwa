class GamesChannel < ApplicationCable::Channel
  def subscribed
    stream_from stream_id
    join_game
  end

  def join_game
    game = Game.find(params[:id])
    game.users << current_user
    ActionCable.server.broadcast(stream_id, type: 'join_game', data: {id: game.id, title: game.title, players: game.users.to_json })
  end

  def unsubscribe
    GamesUsers.where(game_id: params[:id]).where(user_id: current_user.id).destroy_all
  end

  private
  def stream_id
    "game_#{params[:id]}"
  end
end
