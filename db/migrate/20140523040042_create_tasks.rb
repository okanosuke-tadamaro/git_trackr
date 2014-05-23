class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :name
      t.date :due_date
      t.integer :status
      t.references :project, index: true
      t.references :user, index: true

      t.timestamps
    end
  end
end
