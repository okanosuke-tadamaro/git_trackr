class TasksController < ApplicationController

	before_action :signed_in?

	def index
		project = Project.find(params[:projectId].to_i)
		tasks = Task.get_tasks(project)
		respond_to do |format|
			format.html
			format.json { render json: tasks.to_json }
		end
	end

	def create
		params[:task][:branch_name] = 'tr_' + params[:task][:branch_name]
		params[:task][:branch_name] = params[:task][:branch_name].gsub(' ', '_')
		project = Project.find(params[:project_id].to_i)
		task = project.tasks.create(task_params)
		task.update(stage: 'todo', priority: 0)

		#Create new branch on github
		task.create_task_branch(client)

		return_data = task.construct_return_data

		respond_to do |format|
			format.html
			format.json { render json: return_data.to_json }
		end
	end

	def create_subtask
		params[:task][:branch_name] = 'tr_' + params[:task][:branch_name]
		params[:task][:branch_name] = params[:task][:branch_name].gsub(' ', '_')
		parent = Task.find(params[:parent_id].to_i)
		project = parent.project
		subtask = project.tasks.create(task_params)
		subtask.update(status: 0, stage: parent.stage, priority: 0, parent_id: parent.id, last_commit: Time.now)
		parent.subtasks << subtask
		subtask.create_task_branch(client)
		return_data = subtask.construct_return_data

		respond_to do |format|
			format.html
			format.json { render json: return_data.to_json }
		end
	end

	def remove_user
		task = Task.find(params[:task_id])
		user = User.find_by(username: params[:username])
		task.users.destroy(user)

		respond_to do |format|
			format.html
			format.json { render json: user.to_json }
		end
	end

	def add_user
		task = Task.find(params[:task_id])
		user = User.find_by(username: params[:username])
		task.users << user

		respond_to do |format|
			format.html
			format.json { render json: user.to_json }
		end
	end

	def set_order
		project = Project.find(params[:project].to_i)
		tasks = project.tasks.where(stage: params[:stage])
		params[:order].each_with_index do |id, index|
			task = Task.find(id.to_i)
			task.update(priority: index)
		end
		respond_to do |format|
			format.html
			format.json { render json: true.to_json }
		end
	end

  def update_story
    task = Task.find(params[:task_id].to_i)
    task.update(user_story: params[:story])

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
