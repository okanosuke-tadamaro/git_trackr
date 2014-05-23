class Task < ActiveRecord::Base
  
  belongs_to :project
  belongs_to :user
  has_many :nested_tasks
  has_many :subtasks, :through => :nested_tasks

end
