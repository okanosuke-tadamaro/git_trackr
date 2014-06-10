class Task < ActiveRecord::Base
  
  belongs_to :project
  has_and_belongs_to_many :users
  has_many :nested_tasks
  has_many :subtasks, :through => :nested_tasks

  def self.get_tasks(project)
    tasks = project.tasks
  	return_data = []
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
      parent_id: self.parent_id,
      users: self.users.map { |user| [user.avatar_url, user.username] }
    }
  end

  def create_task_branch(client)
    if self.parent_id != nil
      parent = Task.find(self.parent_id).branch_name
    else
      parent = 'development'
    end
    dev_sha = client.branch("#{self.project.author}/#{self.project.name}", parent)[:commit][:sha]
    client.create_ref("#{self.project.author}/#{self.project.name}", "heads/#{self.branch_name}", dev_sha)
    return true
  end

end
