class SearchController < ApplicationController

  def create
    url = "https://api.yelp.com/v3/businesses/search"
    byebug
    values = params
    # values["limit"] = 20
    # Client for requests / responses
    response = HTTP.auth("Bearer #{ENV['API_KEY']}").get(url, params: values)
    array_of_response = response.parse
    render json: array_of_response
  end

end
