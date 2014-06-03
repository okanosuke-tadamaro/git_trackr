var ProjectItemView = Backbone.View.extend({

	tagName: 'li',
	className: 'project-item',
	events: {
		'click #show-project': 'showProject'		
	},
	initialize: function() {
		console.log('projectItemView is initialized');
		this.template = _.template($('#project-item-template').html());
		this.listenTo(this.model, 'remove', this.remove);
		this.listenTo(this.model, 'change', this.render);
		this.render();
	},
	render: function() {
		console.log(this.model.toJSON());
		var createViewFromTemplate = this.template(this.model.toJSON());
		this.$el.html(createViewFromTemplate);
	},
	showProject: function() {
		$('#projects').fadeOut('fast');
		$('#tasks').fadeIn('fast');
	}

});