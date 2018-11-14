class ReviewsController < ApplicationController
  def create
    Market.fetchFromYelp(params[:market_id])
    @review = Review.create(review_params)
    render json: @review
  end

  def update

  end

  def destroy
    @review = Review.find(params[:id].to_i).destroy
  end

  def market_show
    @reviews = Review.all.select{|r| r.market_id == params[:id]}
    render json: @reviews
  end

  def user_show
    @reviews = Review.all.select{|r| r.user_id == params[:id].to_i}
    render json: @reviews
  end

  private

  def review_params
    params.require(:review).permit(:user_id, :market_id, :review_text, :review_title)
  end
end
