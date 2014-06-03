var TaskInputView = Backbone.View.extend({
	el: '#task-input',
	
	events: {
		'click #task-input-submit': 'createNewTask'
	},

	createNewTask: function() {
		// $('#task-input').trigger('closeModal');
		var taskName = $('#project-name').val();
		var taskDueDate = $('#due-date').val();
		var newTask = {name: taskName, due_date: taskDueDate};
		this.collection.create(newTask, {wait: true});
	}
});