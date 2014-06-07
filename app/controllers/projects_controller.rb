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
		@project.check_master(client)
		@project.update(master_status: true) if !@project.master_status && @project.check_master(client)
		@project.update(dev_status: true) if @project.master_status && @project.update_development(client)

		@collaborators = @project.users
		tasks = Task.get_tasks(@project)

		respond_to do |format|
			format.html
			format.json { render json: tasks.to_json }
		end
	end

	def create
		params[:project][:name] = params[:project][:name].gsub(' ', '_')
		project = Project.create(project_params)
		project.update(begin_date: Date.today, master_status: false, dev_status: false, author: current_user.username)
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

		return_data = project.construct_return_data(current_user)

		respond_to do |format|
			format.html
			format.json { render json: return_data.to_json }
		end
	end

	def update
		params[:project][:name] = params[:project][:name].gsub(' ', '_')
		project = Project.find(params[:id])
		project.update_repository(project_params, client)
		project.update(project_params)
		project.update_collaborators(current_user, params[:collaborator_names])
		project.update_github_collaborators(client, current_user)
		return_data = project.construct_return_data(current_user)

		respond_to do |format|
			format.html
			format.json { render json: return_data.to_json }
		end
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