class ProjectsController < ApplicationController

	before_action :signed_in?

	def index
		@projects = current_user.projects
		respond_to do |format|
			format.html
			format.json { render json: @projects.to_json }
		end
	end

	def create
		project = Project.create(name: params[:project_name], description: params[:project_description], begin_date: Date.today, end_date: params[:project_end_date])
		
		#Add Collaborators
		collaborators = params[:project_collaborators].split(' ')
		collaborators.each do |user|
 			project.add_collaborator(user, current_user.github_access_token)
		end

		#Create Repo
	end

	def check_github_user
		User.check_collaborator(params[:collaborator], current_user.github_access_token)
	end

end