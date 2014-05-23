var ProjectItemView = Backbone.View.extend({

	tagName: 'li',
	className: 'project-item',
	events: {

	},
	initialize: function() {
		console.log('projectItemView is initialized');
		this.template = _.template($('#project-item-template').html());
		this.listenTo(this.model, 'remove', this.remove);
		this.listenTo(this.model, 'change', this.render);
		this.render();
	},
	render: function() {
		var createViewFromTemplate = this.template(this.model.toJSON());
		this.$el.html(createViewFromTemplate);
	}

});