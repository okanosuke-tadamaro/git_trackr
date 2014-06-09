class AddLasrCommitToTask < ActiveRecord::Migration
  def change
    add_column :tasks, :last_commit, :time
  end
end
