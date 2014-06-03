var TaskCollectionView = Backbone.View.extend({

	tagName: 'ul',
	className: 'task-list',
	initialize: function() {
		console.log('taskcollectionview is initialized');
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
		var taskItemView = new TaskItemView({model: taskModel});
		this.$el.append(taskItemView.$el);
	}

});