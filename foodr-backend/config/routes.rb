Rails.application.routes.draw do
  get 'products/:search_term', to: 'products#search'
  get 'ingredients/:id', to: 'ingredients#show'
  get 'users/profile/:id', to: 'users#show'
  get 'users/login' , to: 'users#login'
  post 'users/', to: 'users#create'
  post 'searches/:id/save', to: 'searches#save'
end
