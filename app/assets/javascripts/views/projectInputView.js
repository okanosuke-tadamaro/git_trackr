var ProjectInputView = Backbone.View.extend({
	el: '#project-input',
	
	events: {
		'click #project-input-submit': 'createNewProject',
		'keypress #project-collaborators': 'checkCollaborator'
	},

	createNewProject: function() {
		var projectName = $('#project-name').val();
		var projectDescription = $('#project-description').val();
		var projectEndDate = $('#project-date').val();
		var projectCollaborators = $('#project-collaborators').val();
		$.ajax({
			url: '/create_project',
			dataType: 'json',
			method: 'post',
			data: {
				project_name: projectName,
				project_description: projectDescription,
				project_end_date: projectEndDate,
				project_collaborators: projectCollaborators
			}
		});
	},

	checkCollaborator: function(e) {
		if (e.keyCode === 32) {
			var collaboratorToCheck = $(this).val().split(' ')[collaboratorToCheck.length];
			$.ajax({
				url: '/check_collaborator',
				dataType: 'json',
				method: 'get',
				data: { collaborator: collaboratorToCheck }
			}).done(function(data) {
				if (data === 'true') {
					
				}
			});
		}
	}
});