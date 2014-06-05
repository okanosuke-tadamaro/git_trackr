class ProjectsController < ApplicationController

	before_action :signed_in?

	def index
		projects = Project.get_projects(current_user)
		respond_to do |format|
			format.html
			format.json { render json: projects.to_json }
		end
	end

	def show
		@project = Project.find(params[:id])
		@collaborators = @project.users
	end

	def create
		# project = Project.create(name: params[:project_name], description: params[:project_description], begin_date: Date.today, end_date: params[:project_end_date])
		project = Project.create(project_params)
		project.update(begin_date: Date.today)
		current_user.projects << project
	
		#Create Repo on GitHub
		project.create_repository(client)
		
		#Add Collaborators
		collaborators = params[:collaborator_names].split(' ')
		collaborators.each do |user|
 			project.add_collaborator(user, client)
 			#Add collaborator on GitHub
 			project.add_github_collaborator(current_user.username, user, client)
		end

		respond_to do |format|
			format.html
			format.json { render json: true.to_json }
		end
	end

	def update
		project = Project.find(params[:id])
		project.update(project_params)
		project.update_collaborators(params[:project][:collaborator_names])
	end

	def destroy
		project = Project.find(params[:id])
		project.destroy
		respond_to do |format|
			format.html
			format.json { render json: true.to_json }
		end
	end

	def check_github_user
		result = User.check_collaborator(params[:collaborator], client)
		respond_to do |format|
			format.html
			format.json { render json: result.to_json }
		end
	end

	private

	def project_params
		params.require(:project).permit(:name, :description, :begin_date, :end_date)
	end

end