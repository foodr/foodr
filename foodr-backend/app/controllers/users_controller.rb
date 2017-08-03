class UsersController < ApplicationController
  def login
    user = User.find_by(email: params[:email])

    if user && user.authenticate(params[:password])
      render json: {
        found: true,
        id: user.id
      }.to_json
    else
      render json: {
        found: false,
        errors: ['Incorrect e-mail or password']
      }.to_json
    end
  end

  def show
    user = User.find_by(id: params[:id])

    if user
      searches = user.searches

      # find recent searches
      searches = user.recent_searches

      # add product name to each search
      searched_products = searches.map do |search|
        search_hash = JSON.parse(search.to_json)
        search_hash[:product_name] = search.product.name
        search_hash
      end

      # find saved searches
      saved_searches = user.searches.where(is_saved: true)

      saved_products = saved_searches.map do |search|
        search_hash = JSON.parse(search.to_json)
        search_hash[:product_name] = search.product.name
        search_hash
      end

      render json: {
        found: true,
        user: user,
        user_grade: user.grade,
        searches: searches,
        searched_products: searched_products,
        saved_products: saved_products
      }.to_json
    else
      render json: { found: false }.to_json
    end
  end

  def create
    user = User.new(email: params[:email], password: params[:password])
    if user.save
      render json: {
        saved: true,
        user: user
      }.to_json
    else
      render json: {
        saved: false,
        errors: user.errors.full_messages
      }.to_json
    end
  end

end
