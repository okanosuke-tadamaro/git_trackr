class Task < ActiveRecord::Base
  
  belongs_to :project
  has_and_belongs_to_many :users
  has_many :nested_tasks
  has_many :subtasks, :through => :nested_tasks

  def self.get_tasks(project)
  	tasks = project.tasks
  	return_data = []
  	tasks.each do |task|
  		return_data << {
  			branch_name: task.branch_name,
  			user_story: task.user_story,
  			due_date: task.due_date,
  			status: task.status,
  			priority: task.priority,
  			stage: task.stage,
  			users: task.users.map { |user| user.avatar_url }
  		}
  	end
  	return return_data
  end

end
