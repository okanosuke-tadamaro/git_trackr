var ProjectInputView = Backbone.View.extend({
	el: '#project-input',

	events: {
		'click #project-input-submit': 'createNewProject',
		'click #project-edit-submit': 'editProject',
		'keypress #project-collaborators': 'checkCollaborator',
		'click .delete-button': 'deleteCollaborator'
	},

	createNewProject: function() {
		$('#project-input').trigger('closeModal');
		var projectName = $('#project-name').val();
		var projectDescription = $('#project-description').val();
		var projectEndDate = $('#project-date').val();
		var projectCollaborators = $('.taggable-list').find('span.tagged').text();
		var collaboratorAvatars = [$('#user-avatar').attr('src')];
		for(var i = 0; i < $('.tagged-list-item').length; i++) {
			collaboratorAvatars.push($('.tagged-list-item').eq(i).data('avatar_url'));
		}

		var newProject = { name: projectName, description: projectDescription, end_date: projectEndDate, collaborators: collaboratorAvatars, collaborator_names: projectCollaborators };
		// this.collection.create(newProject, {wait: true, reset: true});
		this.model.save(newProject, {wait: true});
		this.collection.fetch();
	},

	editProject: function() {
		$('#project-input').trigger('closeModal');
		
		var pid = $('#project-edit-submit').data('id');
		var thisProject = this.collection.get(pid);

		var projectName = $('#project-name').val();
		var projectDescription = $('#project-description').val();
		var projectEndDate = $('#project-date').val();
		var projectCollaborators = $('.taggable-list').find('span.tagged').text();
		var collaboratorAvatars = [$('#user-avatar').attr('src')];
		for(var i = 0; i < $('.tagged-list-item').length; i++) {
			collaboratorAvatars.push($('.tagged-list-item').eq(i).data('avatar_url'));
		}
		var projectItem = { project: { name: projectName, description: projectDescription, end_date: projectEndDate, collaborators: collaboratorAvatars, collaborator_names: projectCollaborators } };
		$.ajax({
			url: '/projects/' + pid,
			method: 'put',
			dataType: 'json',
			data: projectItem
		}).done(function() {
			this.collection.fetch();
		});
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
			if (data[0] === true) {
				TaggableList.changeToBlock();
				$('.tagged-list-item').eq($('.tagged-list-item').length - 1).data('avatar_url', data[1]);
			}
		});
	}
}
});