class CreateSearches < ActiveRecord::Migration[5.1]
  def change
    create_table :searches do |t|
    	t.integer :product_id
    	t.integer :user_id
    	t.boolean :is_saved

      t.timestamps
    end
  end
end
