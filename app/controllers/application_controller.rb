class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :signed_in?, :current_user

  private

  def signed_in?
    if session[:github_access_token]
      return true
    else
      redirect_to root_path
    end
  end

  def current_user
    User.find_by(github_access_token: session[:github_access_token]) if signed_in?
  end
end
