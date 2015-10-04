class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :current_user, :require_user

  private

  def require_user
    redirect_to splash_path if !current_user
  end

  def current_user
    User.find_by(email: session[:trackr_email])
  end

  def client
    User.new_github_client(current_user.github_access_token)
  end
end
