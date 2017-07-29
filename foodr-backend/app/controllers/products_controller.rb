class ProductsController < ApplicationController
  def search
    search_term = params[:search_term]
    product = Product.find_by(upc: search_term) || Product.find_by(name: search_term)
    if product
      render json: {
        found: true,
        product: product,
        ingredients: product.ingredients
      }.to_json
    else
      render json: { found: false }.to_json
    end
  end
end
