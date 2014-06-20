class AddTaskIdToHistories < ActiveRecord::Migration
  def change
    add_reference :histories, :task, index: true
  end
end
