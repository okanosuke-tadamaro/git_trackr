var TaskItemView = Backbone.View.extend({
	tagName: 'li',
	className: 'task-item',
	events: {
		
	},
	initialize: function() {
		console.log('taskItemView is initialized');
		this.template = _.template($('#task-item-template').html());
		this.listenTo(this.model, 'remove', this.remove);
		this.listenTo(this.model, 'change', this.render);
		this.render();
	},
	render: function() {
		console.log(this.model.toJSON());
		var createTaskViewFromTemplate = this.template(this.model.toJSON());
		this.$el.html(createTaskViewFromTemplate);
	}
});