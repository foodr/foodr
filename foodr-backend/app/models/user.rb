class User < ApplicationRecord
	has_secure_password

	has_many :searches
	has_many :products, through: :searches
	has_many :ingredients, through: :products

  validates :email, :password, presence: true
  validates :email, uniqueness: true

  def grade
    numerator = self.products.pluck(:score).reduce { |sum, score| sum + score }
    denominator = self.products.length
    average = numerator / denominator
    '%.1f' % average # returns 1 decimal place even for round numbers
  end
end
