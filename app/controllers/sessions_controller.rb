class SessionsController < ApplicationController

  def index
    @signin_link = User.oauth_link
  end

  def create
    github_callback = User.parse_github_callback(params[:code])
    client = User.new_github_client(github_callback["access_token"]).user
    session[:github_access_token] = github_callback["access_token"]
    unless User.exists?(username: client.login)
      User.create(username: client.login, github_access_token: github_callback["access_token"])
    end
    redirect_to "/#{client.login}"
  end

  def destroy
    session[:github_access_token] = nil
    redirect_to root_path
  end

end
