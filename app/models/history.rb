class History < ActiveRecord::Base
	
	belongs_to :task

	def self.create_history(task, commit)
		commit_status = commit[:commit][:message].scan(/\btr_\d*\b/).first.gsub('tr_', '').to_i if commit[:commit][:message].include?('tr_')
		commit_status = 0 if (task.histories.empty? || task.histories.order(status: :desc).first.status == nil)
		task.histories.create(commit_date: commit[:commit][:committer][:date], sha: commit[:sha], message: commit[:commit][:message], status: commit_status)
	end

end
