class SessionsController < ApplicationController

  def index
    @signin_link = User.oauth_link
  end

  def create
    @user = User.find_by(email: params[:email])
    if @user && @user.authenticate(params[:password])
      session[:trakr_email] = @user.email
      redirect_to root_path
    else
      redirect_to splash_path, notice: "Please check your information and try again."
    end

    # github_callback = User.parse_github_callback(params[:code])
    # client = User.new_github_client(github_callback["access_token"]).user
    # session[:github_access_token] = github_callback["access_token"]
    #
    # if !User.exists?(username: client.login)
    #   User.create(username: client.login, avatar_url: client.avatar_url ,github_access_token: github_callback["access_token"])
    # elsif User.exists?(username: client.login) && !User.exists?(github_access_token: session[:github_access_token])
    #   user = User.find_by(username: client.login)
    #   user.update(github_access_token: session[:github_access_token])
    # end
  end

  def destroy
    session[:trakr_email] = nil
    redirect_to root_path
  end

end
