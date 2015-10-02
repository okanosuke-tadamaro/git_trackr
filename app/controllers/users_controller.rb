class UsersController < ApplicationController

  def create
    @user = User.new(user_params)
    if @user.save
      session[:trackr_email] = @user.email
      redirect_to root_path, notice: "You're logged in!"
    else
      redirect_to splash_path, notice: "Invalid Request"
    end
  end

  def show
    
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end

end
