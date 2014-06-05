var AppRouter = Backbone.Router.extend({
	routes: {
		'': 'index',
		'projects/:id': 'show'
	},

	initialize: function() {
		console.log('router.js initialized');
		this.projectCollection = new ProjectCollection();
		this.projectCollectionView = new ProjectCollectionView({collection: this.projectCollection});
		this.projectInput = new ProjectInputView({model: new ProjectModel(), collection: this.projectCollection});
		this.taskCollection = new TaskCollection();
		this.taskCollectionView = new TaskCollectionView({collection: this.taskCollection});
		this.taskDoingCollectionView = new TaskDoingCollectionView({collection: this.taskCollection});
		this.taskDoneCollectionView = new TaskDoneCollectionView({collection: this.taskCollection});
		this.taskInput = new TaskInputView({collection: this.taskCollection});
	},

	start: function() {
		Backbone.history.start({pushState: true});
	},

	index: function() {
		console.log('on index route');

		this.projectCollection.fetch({
			reset: true,
			success: function() {
				console.log('fetched');
				$('#projects').html(this.projectCollectionView.$el);
			}.bind(this)
		});

//SETUP EASYMODAL
$('#project-input').easyModal({ top: 100, autoOpen: false, overlayOpacity: 0.3, overlayColor: "#333", overlayClose: false, closeOnEscape: true });
		//CLICK EVENT TO TRIGGER MODAL
		$('#trigger-project-input').click(function() {
			//RESET FORM
			$('.project-input-header h3').text('Create New Project');
			$('#project-input-submit').toggle();
			$('#project-edit-submit').toggle();
			$('#project-name').val('');
			$('#project-description').val('');
			$('#project-date').val('');
			$('.taggable-list .tagged-list-item').remove();
			//OPEN MODAL
			$('#project-input').trigger('openModal');
		});
	},

show: function() {
	console.log('on show route');

	this.projectId = $('.project-info').attr('id');

	this.taskCollection.fetch({
		data: {project: this.projectId},
	
		success: function() {

			console.log('tasks fetched');
			$('#todo .column-body').prepend(this.taskCollectionView.$el);
			$('#doing .column-body').append(this.taskDoingCollectionView.$el);
			$('#done .column-body').append(this.taskDoneCollectionView.$el);
			
			//IF MASTER BRANCH IS NOT SET UP, POP UP THE MODAL WINDOW
			if ($('.project-info').attr('data') == "false") {
				//SETUP EASYMODAL FOR GITHUB NOTICE
				$('#project-notice').easyModal({ top: 100, autoOpen: false, overlayOpacity: 0.3, overlayColor: "#333", overlayClose: false, closeOnEscape: true });

				//OPEN MODAL
				$('#project-notice').trigger('openModal');

				// OK CLICKED REFRESH THE PAGE (WONT SHOW MODAL IF MASTER_STATUS CHANGED TO TRUE IN BACKEND)
				$('#project-notice-submit').click(function(){
					window.location.href=window.location.href;
				});
			} else {
			}


		}.bind(this)
});

//CLICK EVENT TO REVEAL USER STORY FORM
$('#reveal-task-form').click(function() {
	var form = $('#task-input');
	form.appendTo($('#todo .column-body')).fadeIn('fast');
// $('#todo .column-body').append(form);
$(this).fadeOut('fast');
});
}
});