var TaskDoneCollectionView = Backbone.View.extend({

	tagName: 'ul',
	className: 'task-done-list',
	initialize: function() {
		console.log('task-done-collection-view is initialized');
		this.listenTo(this.collection, 'add', this.addOne);
		this.listenTo(this.collection, 'reset', this.addAll);
	},
	addAll: function() {
		console.log('addAll is hit');
		this.$el.empty();
		this.collection.each(this.addOne, this);
	},
	addOne: function(taskModel) {
		console.log('addOne is hit');
		if (taskModel.toJSON().stage === 'done') {
			var taskItemView = new TaskItemView({model: taskModel});
			this.$el.append(taskItemView.$el);
		}
	}

});