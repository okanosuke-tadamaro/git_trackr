function constructProjectItem(value) {
	var listItem = $('<li>').addClass('project-item');
	var projectBox = $('<div>').addClass('project-item-box').attr('id', value.id);
	
	//HEADER PART
	var projectBoxHeader = $('<div>').addClass('project-box-header');
	var header = $('<h3><a href="/projects/' + value.id + '">' + value.name + '</a></h3>');
	var menuItems = $('<ul id="menu-items"><li class="edit-project">Edit</li><li class="destroy-project">Delete</li></ul>');
	var projectMenu = $('<div class="project-menu"><i id="project-menu" class="fa fa-angle-down"></i></div>');
	header.appendTo(projectBoxHeader);
	menuItems.appendTo(projectBoxHeader);
	projectMenu.appendTo(projectBoxHeader);
	projectBoxHeader.appendTo(projectBox);

	//BODY PART
	var projectBoxContent = $('<div>').addClass('project-box-content');
	var boxDescription = $('<p>').text(value.description);
	boxDescription.appendTo(projectBoxContent);
	projectBoxContent.appendTo(projectBox);

	//FOOTER PART
	var projectBoxFooter = $('<div>').addClass('project-box-footer');
	var collaboratorList = $('<ul>').addClass('projects-view-collaborators');
	$.each(value.collaborators, function(i, v) {
		var item = $('<li>');
		var img = $('<img>').attr('src', v[0]);
		img.appendTo(item);
		collaboratorList.append(item);
	});
	collaboratorList.appendTo(projectBoxFooter);
	projectBoxFooter.appendTo(projectBox);

	//APPEND LISTITEM TO DOM UL
	projectBox.appendTo(listItem);
	$('.project-list').append(listItem);
}

function emptyProjectForm() {
	$('#project-name').val('');
	$('#project-description').val('');
	$('#project-date').val('');
	$('.taggable-list .tagged-list-item').remove();
}

var userShow = function() {
	console.log('userShow triggered');

	//CREATE PROJECT
	function createProject() {
		$('#project-input').trigger('closeModal');
		var projectName = $('#project-name').val();
		var projectDescription = $('#project-description').val();
		var projectEndDate = $('#project-date').val();
		var projectCollaborators = $('.taggable-list').find('span.tagged').text();
		var collaboratorAvatars = [$('#user-avatar').attr('src')];
		
		for(var i = 0; i < $('.tagged-list-item').length; i++) {
			collaboratorAvatars.push($('.tagged-list-item').eq(i).data('avatar_url'));
		}

		var newProject = {name: projectName, description: projectDescription, end_date: projectEndDate};
		$.ajax({
			url: '/projects',
			method: 'post',
			dataType: 'json',
			data: {project: newProject, collaborators_avatars: collaboratorAvatars, collaborator_names: projectCollaborators}
		}).done(function(data) {
			emptyProjectForm();
			constructProjectItem(data);
		});
	}

	//GRAB PROJECTS
	function getProjects() {
		$.ajax({
			url: '/projects',
			method: 'get',
			dataType: 'json'
		}).done(function(data) {
			$.each(data, function(index, value) {
				constructProjectItem(value);
			});
		});
	}
	getProjects();

	//SETUP FORM
	$('#project-input').easyModal({ top: 100, autoOpen: false, overlayOpacity: 0.3, overlayColor: "#333", overlayClose: false, closeOnEscape: true });
	$('#project-collaborators').keypress(function(e) {
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
	});




	//CLICK EVENTS
	$('#project-input-submit').click(createProject);
	// $('#project-edit-submit').click(editProject);

	//ADD CLICK EVENT TO NEW PROJECT BUTTON
	$('#trigger-project-input').click(function() {
		$('#project-input').trigger('openModal');
	});

};

var projectShow = function() {
	console.log('projectShow triggered');
};

$(document).ready(function() {

});