class Project < ActiveRecord::Base

	has_and_belongs_to_many :users
	has_many :tasks

	def add_collaborator(user, access_token)
		client = User.new_github_client(access_token)
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

end
