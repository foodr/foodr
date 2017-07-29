Rails.application.routes.draw do
  get 'products/:search_term', to: 'products#search'
  get 'ingredients/:id', to: 'ingredients#show'
end
