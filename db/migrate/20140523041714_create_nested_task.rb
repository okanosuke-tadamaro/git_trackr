class CreateNestedTasks < ActiveRecord::Migration
  def change
    create_table :nested_tasks do |t|
    	t.references :task
    	t.integer :subtask_id
    end
  end
end