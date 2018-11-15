Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :users, only: [:show, :create]
  post "/users", to: 'users#show'
  # resources :search, only: [:index, :show, :create]
  post "/search", to: 'search#create'
  put "/favorites", to: 'favorites#create'
  delete "/favorites/:id", to: 'favorites#destroy'
  get "/favorites/user/:id", to: 'favorites#user_show'
  post "/reviews", to: 'reviews#create'
  get "/reviews/mkt/:id", to: 'reviews#market_show'
  get "/reviews/user/:id", to: 'reviews#user_show'
  delete "/reviews/:id", to: 'reviews#destroy'
  get "/markets/:id", to: 'markets#show'
end
