var ProjectItemView = Backbone.View.extend({

	tagName: 'li',
	className: 'project-item',
	events: {
		'click #show-project': 'showProject',
		'click #project-menu': 'openMenu',
		'click .edit-project': 'editProject',
		'click .destroy-project': 'destroyProject'
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
	},

	openMenu: function(e) {
		console.log('openMenu triggered');
		console.log(this.model.toJSON());
		if ($(e.currentTarget).hasClass('fa-angle-down')) {
			$(e.currentTarget).removeClass('fa-angle-down').addClass('fa-angle-up');
		} else {
			$(e.currentTarget).removeClass('fa-angle-up').addClass('fa-angle-down');
		}
		this.$el.find('h3').slideToggle('fast');
		this.$el.find('#menu-items').slideToggle('fast');
	},

	editProject: function(e) {
		console.log('editProject');
		//Switch header text
		$('.project-input-header h3').text('Edit Project');
		//Switch create and edit button
		$('#project-input-submit').toggle();
		$('#project-edit-submit').toggle();
		//ADD PID TO FORM FOR LATER REFERENCE
		var pid = this.$el.find('.project-item-box').attr('id');
		$('#project-edit-submit').data('id', parseInt(pid));

		$('#project-name').val(this.model.toJSON().name);
		$('#project-description').val(this.model.toJSON().description);
		$('#project-date').val(this.model.toJSON().end_date);
		var collaborators = this.$('.projects-view-collaborators').find('li');
		$('.taggable-list .tagged-list-item').remove();
		$.each(collaborators, function(index, value) {
			var listItem = $('<li class="tagged-list-item"><span class="tagged">' + $(value).find('img').attr('id') + ' </span><span class="delete-button">x</span></li>');
			$('.taggable-list').prepend(listItem);
		});
		$('#project-input').trigger('openModal');
	},

	removeProject: function() {
		this.$el.remove();
	},

	destroyProject: function() {
		this.model.destroy();
	}

});