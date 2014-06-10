function revealSubtaskForm(e) {
	var thisBox = $(e.currentTarget).parent().parent().parent();
	$('#subtask-input').insertAfter(thisBox).show();
}

function openTaskMenu(e) {
	console.log('openTaskMenu');
	var taskId = $(e.currentTarget).parent().parent().attr('id');
	var header = $(e.currentTarget).parent().find('h3');
	if ($(e.currentTarget).hasClass('closed')) {
		var menu = $('<ul>').attr('id', 'task-menu');
		var addSubtaskItem = $('<li>').addClass('add-subtask').text('Add Subtask');
		addSubtaskItem.appendTo(menu);
		addSubtaskItem.click(revealSubtaskForm);
		header.hide();
		menu.prependTo($(e.currentTarget).parent()).show();
		$(e.currentTarget).find('i').removeClass('fa-caret-square-o-down').addClass('fa-caret-square-o-up');
		$(e.currentTarget).removeClass('closed').addClass('open');
	} else {
		header.show();
		var existingMenu = $(e.currentTarget).parent().find('#task-menu');
		existingMenu.remove();
		$(e.currentTarget).find('i').removeClass('fa-caret-square-o-up').addClass('fa-caret-square-o-down');
		$(e.currentTarget).removeClass('open').addClass('closed');
	}
}

function addUser(task, user) {
	$.ajax({
		url: '/add_user',
		method: 'post',
		dataType: 'json',
		data: {task_id: parseInt(task), username: user}
	}).done(function(data) {
		console.log('added user');
	});
}

function removeUser(task, user) {
	$.ajax({
		url: '/remove_user',
		method: 'delete',
		dataType: 'json',
		data: {task_id: parseInt(task), username: user}
	}).done(function(data) {
		console.log('removed user');
	});
}

function createSubtask() {
	var parentItem = $(this).parent().parent().parent().parent().parent().find('.task-item-box');
	$.ajax({
		url: '/create_subtask',
		method: 'post',
		dataType: 'json',
		data: {
			task: {
				branch_name: parentItem.parent().find('#subtask-branch-name').val(),
				user_story: parentItem.parent().find('#subtask-user-story').val(),
				due_date: parentItem.parent().find('#subtask-due-date').val()
			}, parent_id: parentItem.attr('id')}
	}).done(function(data) {
		var newSubtask = constructTaskItem(data);
		newSubtask.removeClass('task-item').addClass('subtask-item');
		$('#' + data.parent_id).parent().find('.subtask-list').append(newSubtask);
	});
}

function constructTaskItem(data) {
	var taskItem = $('<li>').addClass('task-item');
	taskItem.data('parent_id', data.parent_id);
	taskItem.data('id', data.id);
	taskItem.data('stage', data.stage);
	taskItem.data('status', data.status);
	var box = $('<div>').addClass('task-item-box').attr('id', data.id);

	var header = $('<div>').addClass('task-box-header');
	var name = $('<h3>').text(data.branch_name);
	var branchLabel = $('<i>').addClass('fa').addClass('fa-code-fork');
	var taskMenu = $('<div>').addClass('task-menu-button').addClass('closed');
	var taskMenuButton = $('<i>').addClass('fa').addClass('fa-caret-square-o-down');
	var clear = $('<div>').addClass('clear');
	branchLabel.prependTo(name);
	name.appendTo(header);
	taskMenuButton.appendTo(taskMenu);
	if (data.parent_id === null) {
		taskMenu.appendTo(header);
	}
	clear.appendTo(header);
	header.appendTo(box);
	taskMenu.click(openTaskMenu);

	var content = $('<div>').addClass('task-box-content');
	var userStoryBox = $('<div>').addClass('user-story-box');
	var userStoryLabel = $('<p>').addClass('user-story-label').text('User Story:');
	var userStory = $('<p>').text(data.user_story);
	var dueDateIcon = $('<i>').addClass('fa').addClass('fa-calendar');
	var dueDate = $('<p>').addClass('due-date').text(data.due_date);
	var progressWrap = $('<div>').addClass('progress-bar');
	var innerProgress = $('<div>').addClass('progress-inner');
	var status = $('<p>').text(data.status);
	userStoryLabel.appendTo(userStoryBox);
	dueDateIcon.prependTo(dueDate);
	dueDate.appendTo(userStoryBox);
	clear.clone().appendTo(userStoryBox);
	userStory.appendTo(userStoryBox);
	content.append(userStoryBox);
	innerProgress.appendTo(progressWrap);
	progressWrap.appendTo(content);
	content.appendTo(box);

	var footer = $('<div>').addClass('task-box-footer');
	var ulAssignees = $('<ul>').addClass('task-view-assignees');
	$.each(data.users, function(index, value) {
		var assignee = $('<li>').addClass('task-assignee');
		var img = $('<img>').attr('src', value[0]).attr('id', value[1]);
		img.appendTo(assignee);
		assignee.appendTo(ulAssignees);
	});
	ulAssignees.appendTo(footer);
	footer.appendTo(box);
	box.appendTo(taskItem);

	var subtaskList = $('<div>').addClass('subtask-list');
	subtaskList.appendTo(taskItem);

	return taskItem;
}

function appendBox(value) {
	if (value.data('status') === 0) {
		$('#todo .task-list').append(value);
	} else if (value.data('status') > 0 && value.data('status') < 100) {
		$('#doing .task-list').append(value);
	} else if (value.data('status') === 100) {
		$('#done .task-list').append(value);
	}
}

function progress(percent, element) {
  var progressBarWidth = percent * element.width() / 100;
  element.find('.progress-inner').animate({ width: progressBarWidth }, 500).html(percent + "%&nbsp;");
}

function showTaskForm(e) {
	$('#task-input').appendTo('#todo .column-body');
	$(e.currentTarget).hide();
	$('#task-input').show();
}

function createTask() {
	var projectId = $('.project-info').attr('id');
	var branchName = $('#branch-name').val();
	var userStory = $('#user-story').val();
	var dueDate = $('#due-date').val();
	$.ajax({
		url: '/tasks',
		method: 'post',
		dataType: 'json',
		data: {task: {branch_name: branchName, user_story: userStory, due_date: dueDate}, project_id: projectId}
	}).done(function(data) {
		var item = constructTaskItem(data);
		appendBox(item);
	});
}

function grabTasks() {
	console.log('grabbing tasks');
	$.ajax({
		url: '/tasks',
		method: 'get',
		dataType: 'json',
		data: {projectId: $('.project-info').attr('id')}
	}).done(function(data) {
		//CONSTRUCT TASK BOXES
		var boxes = [];
		$.each(data, function(index, value) {
			boxes.push(constructTaskItem(value));
			// progress(value.status, $('#' + value.id).find('.progress-bar'));
		});
		console.log('boxes');
		console.log(boxes);
		//APPEND BOXES TO DOM
		var topLevels = $.grep(boxes, function(value) {
			return value.data('parent_id') === null;
		});
		console.log('topLevels');
		console.log(topLevels);
		while (boxes.length > topLevels.length) {
			if (boxes[0].data('parent_id') !== null) {
				var currentBox = boxes.splice(0, 1)[0];
				var parent = boxes[$.inArray($.grep(boxes, function(value) { return value.data('id') === currentBox.data('parent_id'); })[0], boxes)];
				var subtaskBox = $('<div>').addClass('subtask-item');
				subtaskBox.append($(currentBox).children());
				console.log($(currentBox).children());
				parent.find('.subtask-list').append(subtaskBox);
			}
		}
		$.each(boxes, function(index, value) {
			appendBox(value);
			progress(value.data('status'), $('#' + value.data('id')).find('.progress-bar'));
		});

		$('.task-view-assignees').droppable({
			accept: '.user-list li',
			scope: 'users',
			drop: function(event, ui) {
				console.log('dropped');
				var img = $(ui.draggable.context).find('img').clone().removeClass('avatar');
				var listItem = $('<li>').addClass('task-assignee').addClass('ui-draggable');
				var task = $(this).parent().parent().attr('id');
				img.appendTo(listItem);
				addUser(parseInt(task), img.attr('id'));
				$(this).append(listItem);
			}
		});
		$('.task-view-assignees li').dblclick(function(e) {
			var task = $(e.currentTarget).parent().parent().parent().attr('id');
			var user = $(e.currentTarget).find('img').attr('id');
			removeUser(task, user);
			$(e.currentTarget).remove();
		});
		$('.task-list').sortable({
			items: 'li:not(.subtask-item)',
			cancel: '.subtask-item',
			containment: '.task-list',
			revert: 'invalid'
		});
		$('.task-list .subtask-item').disableSelection();
	});
}

var projectShow = function() {
	console.log('projectShow triggered');

	// SETUP MASTER BRANCH MODAL
	$('#project-notice').easyModal({ top: 100, autoOpen: false, overlayOpacity: 0.3, overlayColor: "#333", overlayClose: false, closeOnEscape: true });
	if($('.project-info').attr('data') === 'false') {
		$('#project-notice').trigger('openModal');
	}

	// REVEAL TASK FORM
	$('#reveal-task-form').click(showTaskForm);

	//CLICK EVENTS
	$('#task-input-submit').click(createTask);
	$('#subtask-input-submit').click(createSubtask);

	grabTasks();

	// //SORTABLES
	// $('.task-list').sortable({
	// 	nested: false,
	// 	exclude: 'li'
	// });
	$('.user-list li').draggable({
		scope: 'users',
		revert: 'invalid',
		helper: 'clone'
	});
};