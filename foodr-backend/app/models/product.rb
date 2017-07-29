class Product < ApplicationRecord
	has_many :searches
	has_many :users, through: :searches
	has_many :ingredient_products
	has_many :ingredients, through: :ingredient_products
end
