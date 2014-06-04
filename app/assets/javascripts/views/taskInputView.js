var TaskInputView = Backbone.View.extend({
	
	el: '#task-input',
	events: {
		'click #task-input-submit': 'createNewTask'
	},
	createNewTask: function() {
		var path = window.location.pathname.split('/');
		var projectId = path[path.length - 1];
		var branchName = $('#branch-name').val();
		var userStory = $('#user-story').val();
		var dueDate = $('#due-date').val();
		var newTask = {branch_name: branchName, user_story: userStory, due_date: dueDate, project_id: projectId};
		this.collection.create(newTask, {wait: true});
	}
});