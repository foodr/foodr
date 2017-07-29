class IngredientsController < ApplicationController
  def show
    ingredient = Ingredient.find_by(id: params[:id])

    if ingredient
      render json: {
        found: true,
        ingredient: ingredient
      }.to_json
    else
      render json: { found: false }.to_json
    end
  end
end