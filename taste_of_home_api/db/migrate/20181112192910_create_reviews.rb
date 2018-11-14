class CreateReviews < ActiveRecord::Migration[5.2]
  def change
    create_table :reviews do |t|
      t.integer :user_id
      t.string :market_id
      t.text :review_text
      t.string :review_title
      t.string :user_name
      t.timestamps
    end
  end
end
