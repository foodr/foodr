class CreateIngredientProducts < ActiveRecord::Migration[5.1]
  def change
    create_table :ingredient_products do |t|
    	t.integer :product_id
    	t.integer :ingredient_id

      t.timestamps
    end
  end
end
