class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :name
      t.string :description
      t.date :begin_date
      t.date :end_date
      t.boolean :master_status
      t.boolean :dev_status
      t.string :author

      t.timestamps
    end
  end
end
