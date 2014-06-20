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

	def update_collaborators(current_user, collaborators)
		formatted_collaborators = collaborators.map { |collaborator| [collaborator.last.first, collaborator.last.last] }
		filtered_collaborators = formatted_collaborators.reject { |collaborator| collaborator.first == current_user.username }
		self.users = []
		self.users << current_user
		filtered_collaborators.each do |collaborator|
			User.create(username: collaborator.first, avatar_url: collaborator.last) if !User.exists?(username: collaborator.first)
			self.users << User.find_by(username: collaborator.first)
		end
		return true
	end

	def update_github_collaborators(client, current_user)
		github_collaborators = client.collaborators(self.author + '/' + self.name).map { |info| info[:login] }
		self.users.each { |user| client.add_collaborator(self.author + '/' + self.name, user.username) unless github_collaborators.include?(user.username) }
		github_collaborators.each { |collaborator| client.remove_collaborator(self.author + '/' + self.name, collaborator) unless self.users.map { |user| user.username }.include?(collaborator) }
		return true
	end

	def out_of_sync?(client)
		# updated = self.tasks.order(last_commit: :desc).first.last_commit
		# github_repo = client.repository(self.author + '/' + self.name)
		# return true if github_repo.pushed_at > (self.updated_at.to_time)
		true
	end

	def update_project(client)
		# UPDATE EXISTING BRANCHES
		self.tasks.each do |task|
			begin
				commits = client.commits(self.author + '/' + self.name, task.branch_name)
			rescue
				break
			end
			commits.each do |commit|
				parent = commit[:parents].empty? ? "na" : commit[:parents].first[:sha]
				if !History.exists?(sha: commit[:sha]) && task.histories.exists?(sha: parent)
					History.create_history(task, commit)
					break					
				end
			end
		end

		# CATCH EXTERNALLY CREATED BRANCHES
		# branches = client.branches(self.author + '/' + self.name)
		# tasks = self.tasks.map { |task| task.branch_name }
		# branch_names = branches.map { |branch| branch[:name] }
		# branch_names.delete("master") && branch_names.delete("development")
		# new_branch_names = branch_names - tasks
		# if !new_branch_names.empty?
		# 	new_branch_names.each do |branch|
		# 		if branch.include?('tr_')
		# 			new_branch = client.commits(self.author + '/' + self.name, branch)
		# 			new_task = self.tasks.create(branch_name: branch, due_date: Date.today + 1.week, priority: 0, stage: 'todo')
		# 			status = new_branch[:commit][:commit][:message].include?('tr_') ? new_branch[:commit][:commit][:message].scan(/\btr_\d*\b/).first.gsub('tr_', '').to_i : 0
		# 			history = new_task.histories.create(commit_date: new_branch[:commit][:commit][:committer][:date], sha: new_branch[:commit][:sha], message: new_branch[:commit][:commit][:message], status: status)
		# 		end
		# 	end
		# end
	end

end
