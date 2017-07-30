# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

3.times do
	User.create(email: Faker::Internet.safe_email, password: "password")
end

Product.create(
  upc: "03077504",
  name: "Quaker Chewy Chocolate Chip Bar",
  score: 3,
  img_url: "https://images-na.ssl-images-amazon.com/images/I/81wqeA8l9CL._SL1500_.jpg")

Product.create(
  upc: "40084510",
  name: "Hanute Hazelnut Wafer",
  score: 2,
  img_url: "https://images-na.ssl-images-amazon.com/images/I/815%2BCzZIVxL._SX355_.jpg")

Product.create(
  upc: "0028400641326",
  name: "Doritos Cool Ranch Tortilla Chips",
  score: 1,
  img_url: "https://images-na.ssl-images-amazon.com/images/I/41Qt4eoxzHL.jpg")

Search.create(user_id: User.first.id, product_id: Product.first.id, is_saved: true)
Search.create(user_id: User.first.id, product_id: Product.second.id, is_saved: false)
Search.create(user_id: User.second.id, product_id: Product.third.id, is_saved: true)
Search.create(user_id: User.second.id, product_id: Product.first.id, is_saved: false)
Search.create(user_id: User.third.id, product_id: Product.second.id, is_saved: true)
Search.create(user_id: User.first.id, product_id: Product.last.id, is_saved: true)

ing1 = Ingredient.create(
  name: Faker::Food.ingredient,
  description: "this is healthy",
  is_natural: true)

ing2 = Ingredient.create(
  name: Faker::Food.ingredient,
  description: "this is unhealthy",
  is_natural: false)

ing3 = Ingredient.create(
  name: Faker::Food.ingredient,
  description: "this is healthy",
  is_natural: true)

ing4 = Ingredient.create(
  name: Faker::Food.ingredient,
  description: "this is unhealthy",
  is_natural: false)

ing5 = Ingredient.create(
  name: Faker::Food.ingredient,
  description: "this is healthy",
  is_natural: true)

ing6 = Ingredient.create(
  name: Faker::Food.ingredient,
  description: "this is unhealthy",
  is_natural: false)


ingredients = [ing1, ing2, ing3, ing4, ing5, ing6]

Product.all.each do |product|
	product.ingredients << ingredients.sample
	product.ingredients << ingredients.sample
	product.ingredients << ingredients.sample
end





