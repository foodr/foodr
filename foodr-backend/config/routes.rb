Rails.application.routes.draw do
  get 'products/name/:search_term', to: 'products#search_name'
  get 'products/upc/:search_term', to: 'products#search_upc'

  get 'ingredients/:id', to: 'ingredients#show'

  get 'users/profile/:id', to: 'users#show'
  get 'users/login' , to: 'users#login'
  post 'users/', to: 'users#create'

  post 'searches/:id/save', to: 'searches#save'
  get 'searches/:id', to: 'searches#show'
end
