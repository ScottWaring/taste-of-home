class ReviewsController < ApplicationController
  def create
    @review = Review.create(review_params)
    render json: @review
  end

  def update

  end

  def destroy
  end

  private

  def review_params
    params.require(:review).permit(:user_id, :market_id, :review_text, :review_title)
  end
end
