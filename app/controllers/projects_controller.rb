class ProjectsController < ApplicationController

	before_action :signed_in?

	def index
		@projects = current_user.projects
		respond_to do |format|
			format.html
			format.json { render json: @projects.to_json }
		end
	end

end