class Market < ApplicationRecord

  def self.fetchFromYelp(marketId)
    @market = Market.find_by(yelp_id: marketId)
    if !@market
      url = "https://api.yelp.com/v3/businesses/#{marketId}"
      response = HTTP.auth("Bearer #{ENV['API_KEY']}").get(url)
      obj = response.parse
      market_hash = {
        :name => obj['name'],
        :image_url => obj['image_url'],
        :address => obj['location']['display_address'],
        :phone_number => obj['phone'],
        :display_phone => obj['display_phone'],
        :web_url => obj['url'],
        :yelp_id => obj['id']
      }
      new_market = Market.create(market_hash)
    end
  end
end
