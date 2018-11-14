class FavoritesController < ApplicationController
  def create
    Market.fetchFromYelp(params[:market_id])
    @favorite = Favorite.create(favorite_params)
    render json: @favorite
  end

  def destroy
      @favorite = Favorite.find(params[:id])
      @favorite.destroy
  end

  def user_show
    @favorites = Favorite.all.select{|f| f.user_id == params[:id].to_i}
    render json: @favorites
  end

  private

  def favorite_params
    params.require(:favorite).permit(:user_id, :market_id)
  end
end
