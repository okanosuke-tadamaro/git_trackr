class AddRepositoryIdToProject < ActiveRecord::Migration
  def change
    add_column :projects, :repository_id, :integer
  end
end
