class ProductsController < ApplicationController
  def search
    search_term = params[:search_term]
    product = Product.find_by(upc: search_term) || Product.find_by(name: search_term)
    if product
      if params[:user_id]
        search = Search.create(user_id: params[:user_id], product_id: product.id, is_saved: false)
      end
      render json: {
        found: true,
        product: product,
        ingredients: product.ingredients,
        search: search
      }.to_json
    else
      render json: { found: false }.to_json
    end
  end
end
