var TaskDoingCollectionView = Backbone.View.extend({

	tagName: 'ul',
	className: 'task-doing-list',
	initialize: function() {
		console.log('task-doing-collection-view is initialized');
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
		if (taskModel.toJSON().stage === 'doing') {
			var taskItemView = new TaskItemView({model: taskModel});
			this.$el.append(taskItemView.$el);
		}
	}

});