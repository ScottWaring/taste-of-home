class CreateSearches < ActiveRecord::Migration[5.2]
  def change
    create_table :searches do |t|
      t.string :location
      t.string :search_term
      t.string :category_filter

      t.timestamps
    end
  end
end
