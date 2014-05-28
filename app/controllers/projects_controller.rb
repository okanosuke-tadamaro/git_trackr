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
		collaborators = params[:project_collaborators].split(' ')
		collaborators.each do |user|
			User.check_and_add_collaborator(user, current_user.github_access_token)
		end
	end

end