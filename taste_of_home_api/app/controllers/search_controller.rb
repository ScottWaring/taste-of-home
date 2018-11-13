class SearchController < ApplicationController

  def create
    url = "https://api.yelp.com/v3/businesses/search"
    body = {
      "limit" => 20,
      "term" => params["term"],
      "categories" => params["categories"]
    }
    if  params.keys.include?("location")
      body["location"] = params["location"]
    else
      body["latitude"] = params["latitude"]
      body["longitude"] = params["longitude"]
    end
    response = HTTP.auth("Bearer #{ENV['API_KEY']}").get(url, params: body)
    array_of_response = response.parse
    render json: array_of_response
  end

end
