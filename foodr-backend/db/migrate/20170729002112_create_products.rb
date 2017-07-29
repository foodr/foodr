class CreateProducts < ActiveRecord::Migration[5.1]
  def change
    create_table :products do |t|
    	t.string :upc
    	t.string :name
    	t.integer :score
    	t.string :img_url

      t.timestamps
    end
  end
end
