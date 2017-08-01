class UsersController < ApplicationController
  def authenticate
    user = User.find_by(email: params[:email])

    if user
      render json: {
        found: true,
        id: user.id
      }.to_json
    else
      render json: { found: false }.to_json
    end
  end

  def show
    user = User.find_by(id: params[:id])

    if user
      searches = user.searches
      searched_products = user.products
      saved_product_ids = user.searches.where(is_saved: true).pluck(:product_id)
      saved_products = Product.find(saved_product_ids)

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