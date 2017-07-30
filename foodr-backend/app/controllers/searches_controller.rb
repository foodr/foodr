class SearchesController < ApplicationController

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