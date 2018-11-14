class CreateMarkets < ActiveRecord::Migration[5.2]
  def change
    create_table :markets do |t|
      t.string :image_url
      t.string :name
      t.string :address
      t.integer :phone_number
      t.string :display_phone
      t.string :web_url
      t.string :yelp_id
      t.timestamps
    end
  end
end
