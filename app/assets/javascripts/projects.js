// UI FUNCTIONALITY
function showTaskForm(e) {
  $('#task-input').appendTo('#todo .column-body');
  $(e.currentTarget).hide();
  $('#task-input').show();
}

function revealSubtaskForm(e) {
  var thisBox = $(e.currentTarget).parent().parent().parent().parent();
  $('#subtask-input').data('parent_id', thisBox.data('id'));
  $('#subtask-input').insertAfter(thisBox).show();
}

function hideTaskForm(e) {
  $(e.currentTarget).parent().parent().parent().hide();
  $('#reveal-task-form').show();
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

function appendBox(task, status) {
  if (status === 0) {
    $('#todo .task-list').append(task);
  } else if (status > 0 && status < 100) {
    $('#doing .task-list').append(task);
  } else if (status === 100) {
    $('#done .task-list').append(task);
  }
}

//TALKING TO BACK-END FUNCTIONALITY
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
    grabTasks();
    // var item = constructTaskItem(data);
    // appendBox(item, data.status);
  });
}

function createSubtask() {
  var parentItem = $(this).parent().parent().parent().parent();
  var parentId = parentItem.data('parent_id');
  $.ajax({
    url: '/create_subtask',
    method: 'post',
    dataType: 'json',
    data: {
      task: {
              branch_name: parentItem.parent().find('#subtask-branch-name').val(),
    user_story: parentItem.parent().find('#subtask-user-story').val(),
    due_date: parentItem.parent().find('#subtask-due-date').val()
            },
    parent_id: parentId
    }
  }).done(function(data) {
    grabTasks();
    // var newSubtask = constructTaskItem(data);
    // newSubtask.removeClass('task-item').addClass('subtask-item');
    // $('#' + data.parent_id).parent().find('.subtask-list').append(newSubtask);
  });
}

function constructSubtaskItem(data) {
  var subtask = _.template($('#subtask-item-template').html(), data);
  return subtask;
}

function constructTaskItem(data) {
  var task = _.template($('#task-item-template').html(), data);
  return task;
}

function progress(percent, element) {
  var progressBarWidth = percent * element.width() / 100;
  element.find('.progress-inner').animate({ width: progressBarWidth }, 500).html(percent + "%&nbsp;");
}

function grabTasks() {
  $.ajax({
    url: '/tasks',
  method: 'get',
  dataType: 'json',
  data: {projectId: $('.project-info').attr('id')}
  }).done(function(data) {
    $('.task-list').empty();
    var boxes = [];
    $.each(data, function(index, value) {
      if (value.parent_id === null) {
        var taskItem = constructTaskItem(value);
        appendBox(taskItem, value.status);
        progress(value.status, $('#' + value.id).find('.progress-bar'));
        $('#' + value.id).find('.task-menu-button').click(openTaskMenu);
      } else {
        boxes.push(index);
      }
    });

    // APPEND SUBTASKS TO COLUMN
    _.each(boxes, function (value) {
      var subtask = constructSubtaskItem(this[value]);
      $('li[data-id="' + this[value].parent_id + '"] .subtask-list').append(subtask);
      progress(this[value].status, $('#' + this[value].id).find('.progress-bar'));
      $('#' + this[value].id).find('.task-menu-button').click(openTaskMenu);
    }, data);

    // ADD USER FROM SIDE BAR
    $('.task-view-assignees').droppable({
      accept: '.user-list li',
      scope: 'users',
      drop: function(event, ui) {
        console.log('dropped');
        var assignees = [];
        $(this).find('img').each(function(value) {
          assignees.push($(this).attr('id'));
        });
        if (!_.contains(assignees, $(ui.draggable.context).find('img').attr('id'))) {
          var img = $(ui.draggable.context).find('img').clone().removeClass('avatar');
          var listItem = $('<li>').addClass('task-assignee').addClass('ui-draggable');
          var task = $(this).parent().parent().attr('id');
          img.appendTo(listItem);
          addUser(parseInt(task), img.attr('id'));
          $(this).append(listItem);
        }
      }
    });

    // REMOVE USER ON DBLCLICK
    $('.task-view-assignees').on('dblclick', 'li', function(e) {
      var task = $(e.currentTarget).parent().parent().parent().attr('id');
      var user = $(e.currentTarget).find('img').attr('id');
      removeUser(task, user);
      $(e.currentTarget).remove();
    });

    // SORTABLE TASKS (IN COLUMNS)
    $('.task-list').sortable({
      items: 'li:not(.subtask-item)',
      cancel: '.subtask-item',
      stop: function(event, ui) {
        console.log('stopped');
        var project = $('.project-info').attr('id');
        var stage = ui.item.parent().parent().parent().attr('id');
        var list = ui.item.parent().find('.task-item');
        var order = [];
        list.each(function(index, value) {
          order.push(value.dataset.id);
        });
        $.ajax({
          url: '/set_order',
          method: 'put',
          dataType: 'json',
          data: {order: order, stage: stage, project: project}
        });
      },
      revert: 'invalid'
    });
    $('.task-list .subtask-item').disableSelection();
  });
}

function editStory(e) {
  e.stopPropagation();
  var userStoryForm = $('<textarea>').addClass('edit-story').text(e.currentTarget.innerHTML);
  $(e.currentTarget).hide();
  userStoryForm.insertAfter($(e.currentTarget));
  userStoryForm.focus();
}

function saveStory() {
  var story = $('.edit-story');
  var task = story.parent().parent().parent().attr('id');
  $.ajax({
    url: '/update_story',
    method: 'put',
    dataType: 'json',
    data: {task_id: task, story: story.val()}
  }).done(function(data) {
    var story = $('.edit-story').parent().find('.user-story');
    $('.edit-story').remove();
    story.text(data.user_story);
    story.show();
  });
}

var projectShow = function() {
  console.log('projectShow triggered');

  // SETUP MASTER BRANCH MODAL
  $('#project-notice').easyModal({ top: 100, autoOpen: false, overlayOpacity: 0.3, overlayColor: "#333", overlayClose: false, closeOnEscape: true });
  if($('.project-info').attr('data') === 'false') {
    $('#project-notice').trigger('openModal');
  }

  // REVEAL & CLOSE TASK FORM
  $('#reveal-task-form').click(showTaskForm);
  $('.task-form-close').click(hideTaskForm);

  //CLICK EVENTS
  $('#task-input-submit').click(createTask);
  $('#subtask-input-submit').click(createSubtask);

  grabTasks();

  $('.user-list li').draggable({
    scope: 'users',
    revert: 'invalid',
    helper: 'clone'
  });

  $('.task-list').on('dblclick', '.user-story', editStory);
  $(document).click(function(e) {
    if ($('.edit-story').length !== 0  && !$(e.target).hasClass('edit-story')) {
      saveStory();
    }
  });
};
