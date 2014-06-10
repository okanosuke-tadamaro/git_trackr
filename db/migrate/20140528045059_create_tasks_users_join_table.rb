class CreateTasksUsersJoinTable < ActiveRecord::Migration
  def change
		create_join_table :tasks, :users, table_name: :tasks_users
	end
end
