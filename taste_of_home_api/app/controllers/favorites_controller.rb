class FavoritesController < ApplicationController
  def create
    # byebug
    @favorite = Favorite.create(favorite_params)
    render json: @favorite
  end

  def destroy
      @favorite = Favorite.find(params[:id])
      @favorite.destroy
  end


  private

  def favorite_params
    params.require(:favorite).permit(:user_id, :market_id)
  end
end
