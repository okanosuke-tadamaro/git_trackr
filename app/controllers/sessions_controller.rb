class SessionsController < ApplicationController

  def index
    @signin_link = User.oauth_link
  end

  def create
    github_callback = User.parse_github_callback(params[:code])
    client = User.new_github_client(github_callback["access_token"]).user
    session[:github_access_token] = github_callback["access_token"]

    if !User.exists?(username: client.login)
      User.create(username: client.login, avatar_url: client.avatar_url ,github_access_token: github_callback["access_token"])
    elsif User.exists?(username: client.login) && !User.exists?(github_access_token: session[:github_access_token])
      user = User.find_by(username: client.login)
      user.update(github_access_token: session[:github_access_token])
    end

    redirect_to root_path
  end

  def destroy
    session[:github_access_token] = nil
    redirect_to root_path
  end

  def guide

  end

end
