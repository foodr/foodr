class UsersController < ApplicationController
  def show
    user = User.find_by(id: params[:id])
    searches = user.products
    saved_product_ids = user.searches.where(is_saved: true).pluck(:product_id)
    saved_products = Product.find(saved_product_ids)

    if user
      render json: {
        found: true,
        user: user,
        searches: searches,
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