class MarketsController < ApplicationController
  def show
    @market = Market.find_by(yelp_id: params[:id])
    render json: @market
  end
end
