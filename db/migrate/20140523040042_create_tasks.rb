class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :branch_name
      t.string :user_story
      t.date :due_date
      t.integer :status
      t.integer :priority
      t.string :stage
      t.references :project, index: true

      t.timestamps
    end
  end
end
