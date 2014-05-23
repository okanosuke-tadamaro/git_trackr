class CreateSubtask < ActiveRecord::Migration
  def change
    create_table :subtasks do |t|
    	t.references :task
    	t.integer :subtask_id
    end
  end
end
