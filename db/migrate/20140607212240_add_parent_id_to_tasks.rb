class AddParentIdToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :parent_id, :integer
  end
end
