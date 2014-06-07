class Project < ActiveRecord::Base

	has_and_belongs_to_many :users
	has_many :tasks

	def self.get_projects(current_user)
		return_data = []
		current_user.projects.each do |project|
			return_data << project.construct_return_data(current_user)
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

	def construct_return_data(current_user)
		return {
			id: self.id,
			name: self.name,
			description: self.description,
			end_date: self.end_date,
			author: self.author,
			collaborators: self.users.map { |user| [user.avatar_url, user.username] }
		}
	end

	def check_master(client)
		begin
		 	client.branch("#{self.author}/#{self.name}", "master")
		 	return true
		rescue
		 	return false
		end
	end

	def update_development(client)
		begin
			client.branch("#{self.author}/#{self.name}", "development")
			return true
		rescue
			master_sha = client.branch("#{self.author}/#{self.name}", "master")[:commit][:sha]
			client.create_ref("#{self.author}/#{self.name}", "heads/development", master_sha)
			return true
		end
	end
	
	def create_repository(client)
		client.create_repository(self.name, options = {:description => self.description})
	end

	def add_github_collaborator(current_username, user, client)
		client.add_collaborator("#{current_username}/#{self.name}", user)
	end

	def update_repository(project_params, client)
		client.edit_repository(self.author + '/' + self.name, {name: project_params[:name], description: project_params[:description]})
		return true
	end

	def update_collaborators(current_user, collab_string)
		collaborators = collab_string.split(' ')
		filtered_collaborators = collaborators.reject { |collaborator| collaborator == current_user.username }
		self.users = []
		self.users << current_user
		filtered_collaborators.each { |collaborator| self.users << User.find_by(username: collaborator) }
		return true
	end

	def update_github_collaborators(client, current_user)
		github_collaborators = client.collaborators(self.author + '/' + self.name).map { |info| info[:login] }
		self.users.each { |user| client.add_collaborator(self.author + '/' + self.name, user.username) unless github_collaborators.include?(user.username) }
		github_collaborators.each { |collaborator| client.remove_collaborator(self.author + '/' + self.name, collaborator) unless self.users.map { |user| user.username }.include?(collaborator) }
		return true
	end

end
