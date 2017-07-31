class CreateIngredients < ActiveRecord::Migration[5.1]
  def change
    create_table :ingredients do |t|
    	t.string :name
    	t.text :description
    	t.boolean :is_natural
    	t.string :img_url

      t.timestamps
    end
  end
end
