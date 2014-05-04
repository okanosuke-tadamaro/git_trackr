class UsersController < ApplicationController

  before_action :signed_in? 

  def show
    @user = User.find_by(github_access_token: session[:github_access_token])
  end

end
