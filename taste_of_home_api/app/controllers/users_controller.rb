class UsersController < ApplicationController
  def index
    @users = User.all
    render json: @users
  end

  def show
  end

  def create
    @user = User.find_or_create_by(user_params)
    @user.save
    if @user
      # session_log(@user)
      render json: @user
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :password)
  end
end
