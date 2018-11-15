class UsersController < ApplicationController
  def index
    @users = User.all
    render json: @users
  end

  def show
    @user = User.find_by(name: params[:name], password: params[:password])
    if @user == nil
      render json: {error: true}
    else
      render json: @user
    end
  end

  def create
    @user = User.create(user_params)
    if @user
      render json: @user
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :password)
  end
end
