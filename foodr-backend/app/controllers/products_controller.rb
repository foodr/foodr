class ProductsController < ApplicationController
  def search_upc
    search_term = params[:search_term]
    product = Product.find_by(upc: search_term)
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

  def search_name
    search_term = params[:search_term]
    product = Product.find_by(name: search_term)
    # Does a fuzzy search if exact product name wasn't found
    if !product
      possible_matches = Product.fuzzy_search(name: search_term)
    end
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
    elsif possible_matches.any?
      render json: {
        matches: possible_matches
      }.to_json
    else
      render json: {
        found: false
      }.to_json
    end
  end
end
