class NestedTask < ActiveRecord::Base

	belongs_to :task
	belongs_to :subtask, :class_name => 'Task'

end