class ProductsController < ApplicationController
  def show
    product = Product.find(params[:id])

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
    if product
      if params[:user_id]
        search = Search.create(user_id: params[:user_id], product_id: product.id, is_saved: false)
      end
      render json: {
        found: true,
        product: product,
        ingredients: product.ingredients,
        search: search
      }.to_json and return
    end

    # Does a fuzzy search if exact product name wasn't found
    # matches is an array of hashes, each containing a product name and id
    matches = fuzzy_search_name(search_term)
    if matches
      render json: {
        matches: matches
      }.to_json and return
    end

    # Returns found: false if both exact match and fuzzy search yielded no results
    render json: {
      found: false,
      matches: []
    }.to_json
  end


  private

  def fuzzy_search_name(search_term)
    possible_matches = Product.fuzzy_search(name: search_term)
    matches = []
    possible_matches.each do |product|
      matches << {id: product.id, name: product.name}
    end
    matches.any? ? matches : nil
  end
end
