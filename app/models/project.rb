class Project < ActiveRecord::Base

	has_and_belongs_to_many :users
	has_many :tasks

	def self.get_projects(current_user)
		return_data = []
		current_user.projects.each do |project|
			return_data << {
				id: project.id,
				name: project.name,
				description: project.description,
				end_date: project.end_date,
				collaborators: project.users.map { |user| user.avatar_url }
			}
		end
		return return_data
	end

	def add_collaborator(user, client)
		if User.exists?(username: user)
			collaborator = User.find_by(username: user)
			self.users << collaborator
		else
			new_user = client.user(user)
			collaborator = User.create(username: user, avatar_url: new_user.avatar_url)
			self.users << collaborator
		end
		return true
	end

	def create_repository(client)
		client.create_repository(self.name, options = {:description => self.description})
	end

	def add_github_collaborator(current_username, user, client)
		client.add_collaborator("#{current_username}/#{self.name}", user)
	end

end
