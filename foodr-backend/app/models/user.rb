class User < ApplicationRecord
	has_secure_password

	has_many :searches
	has_many :products, through: :searches
	has_many :ingredients, through: :products

  validates :email, uniqueness: true

  def grade

  end
end