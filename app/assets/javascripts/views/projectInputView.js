var ProjectInputView = Backbone.View.extend({
	el: '#project-input',
	
	events: {
		'click #project-input-submit': 'createNewProject',
		'keypress #project-collaborators': 'checkCollaborator',
		'click .delete-button': 'deleteCollaborator'
	},

	createNewProject: function() {
		$('#project-input').trigger('closeModal');
		var projectName = $('#project-name').val();
		var projectDescription = $('#project-description').val();
		var projectEndDate = $('#project-date').val();
		var projectCollaborators = $('.taggable-list').find('span.tagged').text();
		var newProject = {name: projectName, description: projectDescription, end_date: projectEndDate, collaborators: projectCollaborators};
		this.collection.create(newProject, {wait: true});
	},

	checkCollaborator: function(e) {
		if (e.keyCode === 32) {
			var collaboratorToCheck = $('#project-collaborators').val();
			$.ajax({
				url: '/check_collaborator',
				dataType: 'json',
				method: 'get',
				data: { collaborator: collaboratorToCheck }
			}).done(function(data) {
				if (data === true) {
					TaggableList.changeToBlock();
				}
			});
		}
	}
});