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
		
	});
}

function constructTaskItem(data) {
	var taskItem = $('<li>').addClass('task-item');
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
	taskMenu.appendTo(header);
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
		img.appendTo(assignees);
		assignees.appendTo(ulAssignees);
	});
	// var subtaskButton = $('<div>').addClass('subtask-button').text('Add Subtask');
	ulAssignees.appendTo(footer);
	footer.appendTo(box);
	box.appendTo(taskItem);
	
	if (data.stage === 'todo') {
		$('#todo .task-list').append(taskItem);
	} else if (data.stage === 'doing') {
		$('#doing .task-list').append(taskItem);
	} else if (data.stage === 'done') {
		$('#done .task-list').append(taskItem);
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
		constructTaskItem(data);
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
		console.log(data);
		$.each(data, function(index, value) {
			console.log(value);
			constructTaskItem(value);
			progress(value.status, $('#' + value.id).find('.progress-bar'));
		});
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
};