class TasksController < ApplicationController

	before_action :signed_in?

	def index
		project = Project.find(params[:project].to_i)
		tasks = Task.get_tasks(project)
		respond_to do |format|
			format.html
			format.json { render json: tasks.to_json }
		end
	end

	def create
		project = Project.find(params[:project_id].to_i)
		task = project.tasks.create(task_params)
		task.status = 0
		task.stage = 'todo'
		task.priority = 0
		task.save

		respond_to do |format|
			format.html
			format.json { render json: task.to_json }
		end
	end

	private

	def task_params
		params.require(:task).permit(:branch_name, :user_story, :due_date, :status, :priority, :stage)
	end

end