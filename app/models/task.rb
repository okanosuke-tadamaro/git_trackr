class Task < ActiveRecord::Base
  
  belongs_to :project
  has_and_belongs_to_many :users
  has_many :nested_tasks
  has_many :subtasks, :through => :nested_tasks

end
