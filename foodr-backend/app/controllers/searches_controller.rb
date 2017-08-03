class SearchesController < ApplicationController

  def show
    search = Search.find(params[:id])
    product = search.product
    if product
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

  def save
    search = Search.find_by(id: params[:id])
    if search
      search.update(is_saved: true)
      render json: {
        save_successful: true,
        search: search,
        product: search.product
      }.to_json
    else
      render json: { save_successful: false }.to_json
    end
  end
end
