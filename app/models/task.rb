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

  def self.create_task_branch(repo, branch_name, sha)
    Octokit.create_ref(repo, branch_name, sha)
    # Octokit.create_ref("octocat/Hello-World","heads/master", "827efc6d56897b048c772eb4087f854f46256132")
    # The name of the fully qualified reference (ie: refs/heads/master). If it doesn’t start with ‘refs’ and have at least two slashes, it will be rejected.
    # create_ref(repo, ref, sha, options = {})
  end

end
