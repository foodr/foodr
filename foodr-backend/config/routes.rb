Rails.application.routes.draw do
  get 'products/:search_term', to: 'products#search'
  get 'ingredients/:id', to: 'ingredients#show'
  get 'users/profile/:id', to: 'users#show'
  get 'users/authenticate' , to: 'users#authenticate'
  post 'users/', to: 'users#create'
  post 'searches/:id/save', to: 'searches#save'
end
