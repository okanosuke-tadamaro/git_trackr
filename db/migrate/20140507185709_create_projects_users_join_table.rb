class CreateProjectsUsersJoinTable < ActiveRecord::Migration
	def change
		create_join_table :projects, :users, table_name: :projects_users
	end
end
