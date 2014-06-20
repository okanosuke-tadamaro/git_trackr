class CreateHistories < ActiveRecord::Migration
  def change
    create_table :histories do |t|
      t.date :commit_date
      t.string :sha
      t.text :message
      t.integer :status

      t.timestamps
    end
  end
end
