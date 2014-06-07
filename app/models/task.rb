class Task < ActiveRecord::Base
  
  belongs_to :project
  has_and_belongs_to_many :users
  has_many :nested_tasks
  has_many :subtasks, :through => :nested_tasks

  def self.get_tasks(project)
  	tasks = project.tasks
  	return_data = []
    # return_data << {master_status: project.master_status}
  	tasks.each do |task|
  		return_data << task.construct_return_data
  	end
  	return return_data
  end

  def construct_return_data
    return {
      id: self.id,
      branch_name: self.branch_name,
      user_story: self.user_story,
      due_date: self.due_date,
      status: self.status,
      priority: self.priority,
      stage: self.stage,
      users: self.users.map { |user| [user.avatar_url, user.username] }
    }
  end

  def create_task_branch(client)
    dev_sha = client.branch("#{self.project.author}/#{self.project.name}", "development")[:commit][:sha]
    client.create_ref("#{self.project.author}/#{self.project.name}", "heads/#{self.branch_name}", dev_sha)
    return true
  end

end
