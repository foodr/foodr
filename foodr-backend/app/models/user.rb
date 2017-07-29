class User < ApplicationRecord
	has_secure_password

	has_many :searches
	has_many :products, through: :searches
	has_many :ingredients, through: :products

end
