function constructProjectItem(value) {
	var listItem = $('<li>').addClass('project-item');
	var projectBox = $('<div>').addClass('project-item-box').attr('id', value.id);
	
	//HEADER PART
	var projectBoxHeader = $('<div>').addClass('project-box-header');
	var header = $('<h3><a href="/projects/' + value.id + '">' + value.name + '</a></h3>');
	var menuItems = $('<ul id="menu-items">');
	var editButton = $('<li class="edit-project">Edit</li>');
	var deleteButton = $('<li class="destroy-project">Delete</li>');
	var projectMenu = $('<div>').addClass('project-menu');
	var menuButton = $('<i id="project-menu" class="fa fa-angle-down"></i>');
	if(value.author === $('#user-avatar').attr('alt')) {
		menuButton.appendTo(projectMenu);
	}
	menuButton.click(openMenu);
	editButton.click(editProject);
	deleteButton.click(deleteProject);
	editButton.appendTo(menuItems);
	deleteButton.appendTo(menuItems);
	header.appendTo(projectBoxHeader);
	menuItems.appendTo(projectBoxHeader);
	projectMenu.appendTo(projectBoxHeader);
	projectBoxHeader.appendTo(projectBox);

	//BODY PART
	var projectBoxContent = $('<div>').addClass('project-box-content');
	var boxDescription = $('<p>').addClass('description').text(value.description);
	var boxDate = $('<p>').addClass('date').text(value.end_date);
	boxDescription.appendTo(projectBoxContent);
	boxDate.appendTo(projectBoxContent);
	projectBoxContent.appendTo(projectBox);

	//FOOTER PART
	var projectBoxFooter = $('<div>').addClass('project-box-footer');
	var collaboratorList = $('<ul>').addClass('projects-view-collaborators');
	$.each(value.collaborators, function(i, v) {
		var item = $('<li>');
		var img = $('<img>').attr('src', v[0]);
		img.attr('id', v[1]);
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

function openMenu(e) {
	console.log('openMenu triggered');
	if ($(e.currentTarget).hasClass('fa-angle-down')) {
		$(e.currentTarget).removeClass('fa-angle-down').addClass('fa-angle-up');
	} else {
		$(e.currentTarget).removeClass('fa-angle-up').addClass('fa-angle-down');
	}
	console.log($(e.currentTarget).parent().parent());
	$(e.currentTarget).parent().parent().find('h3').slideToggle('fast');
	$(e.currentTarget).parent().parent().find('#menu-items').slideToggle('fast');
}

function closeMenu(id) {
	console.log('closeMenu triggered');
	var target = $('#' + id + ' .project-box-header');
	target.find('#menu-items').hide();
	target.find('h3').show();
}

function editProject(e) {
	console.log('edit');
	var item = $(e.currentTarget).parent().parent().parent();
	$('#project-input').find('h3').text('Edit Project');
	$('#project-name').val(item.find('h3').text());
	$('#project-description').val(item.find('.project-box-content .description').text());
	$('#project-date').val(item.find('.project-box-content .date').text());
	$('.taggable-list .tagged-list-item').remove();
	item.find('.projects-view-collaborators img').each(function(index, value) {
		var listItem = $('<li class="tagged-list-item"><span class="tagged">' + $(value).attr('id') + ' </span></li>');
		listItem.data('avatar_url', $(value).attr('src'));
		var deleteButton = $('<span class="delete-button">x</span>');
		deleteButton.click(function() {
			this.parentNode.remove();
		});
		deleteButton.appendTo(listItem);
		$('.taggable-list').prepend(listItem);
	});
	$('#project-input-submit').hide();
	$('#project-edit-submit').show();
	$('#project-edit-submit').data('id', item.attr('id'));
	$('#project-input').trigger('openModal');	
}

function deleteProject() {
	console.log('delete');
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

	function updateProject() {
		$('#project-input').trigger('closeModal');
		closeMenu($('#project-edit-submit').data('id'));
		var projectName = $('#project-name').val();
		var projectDescription = $('#project-description').val();
		var projectEndDate = $('#project-date').val();
		var projectCollaborators = $('.taggable-list').find('span.tagged').text().split(' ');
		projectCollaborators.splice(projectCollaborators.length - 1, 1);
		var collaboratorData = [];
		$(projectCollaborators).each(function(index, value) {
			var avatar = $(".tagged:contains('" + value + "')").parent().data('avatar_url');
			collaboratorData.push([value, avatar]);
		});
		// for(var i = 0; i < $('.tagged-list-item').length; i++) {
		// 	collaboratorAvatars.push($('.tagged-list-item').eq(i).data('avatar_url'));
		// }
		var editedProject = {name: projectName, description: projectDescription, end_date: projectEndDate};
    
		$.ajax({
			url: '/projects/' + $('#project-edit-submit').data('id'),
			method: 'put',
			dataType: 'json',
			data: {project: editedProject, collaborators: collaboratorData}
		}).done(function(data) {
			var targetBox = $('#' + data.id);
			targetBox.find('h3 a').text(data.name);
			targetBox.find('.description').text(data.description);
			targetBox.find('.date').text(data.end_date);
			var userList = targetBox.find('.projects-view-collaborators');
			userList.find('li').remove();
			$.each(data.collaborators, function(i, v) {
				var listItem = $('<li>');
				var img = $('<img>').attr('src', v[0]).attr('id', v[1]);
				listItem.append(img);
				userList.append(listItem);
			});
			targetBox.find('#project-menu').removeClass('fa-angle-up').addClass('fa-angle-down');
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
	$('#project-edit-submit').click(updateProject);

	//ADD CLICK EVENT TO NEW PROJECT BUTTON
	$('#trigger-project-input').click(function() {
		$('#project-input').find('h3').text('Create New Project');
		$('#project-edit-submit').hide();
		$('#project-input-submit').show();
		$('#project-input').trigger('openModal');
	});

};
