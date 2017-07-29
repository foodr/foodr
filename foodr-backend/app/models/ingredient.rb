class Ingredient < ApplicationRecord
	has_many :ingredient_products
	has_many :products, through: :ingredient_products
	has_many :users, through: :products
end
