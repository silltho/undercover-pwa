module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user
 
    def connect
      self.current_user = find_verified_user
    end
 
    private
      def find_verified_user
        if current_user = GamesUsers.find_by(session_id: cookies.signed[:session_id])
          current_user
        else
          reject_unauthorized_connection
        end
      end
  end
end