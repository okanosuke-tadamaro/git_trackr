var AppRouter = Backbone.Router.extend({
	routes: {
		'': 'index',
		'projects/:id': 'show'
	},

	initialize: function() {
		console.log('router.js initialized');
		this.projectCollection = new ProjectCollection();
		this.projectCollectionView = new ProjectCollectionView({collection: this.projectCollection});
		this.projectInput = new ProjectInputView({collection: this.projectCollection});
		this.taskCollection = new TaskCollection();
		this.taskCollectionView = new TaskCollectionView({collection: this.taskCollection});
		this.taskInput = new TaskInputView({collection: this.taskCollection});

		this.route('projects/:id', 'show');
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
			$('#project-input').trigger('openModal');
		});
	},

	show: function() {
		console.log('on show route');

		this.taskCollection.fetch({
			success: function() {
				console.log('tasks fetched');
				$('#tasks').html(this.taskCollectionView);
			}
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