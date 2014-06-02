var AppRouter = Backbone.Router.extend({
	routes: {
		':username': 'index'
	},
	initialize: function() {
		console.log('router.js initialized');
		this.projectCollection = new ProjectCollection();
		this.projectCollectionView = new ProjectCollectionView({collection: this.projectCollection});
		this.projectInput = new ProjectInputView({collection: this.projectCollection});
	},
	start: function() {
		Backbone.history.start();
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

		$('#project-input').easyModal({ top: 100, autoOpen: false, overlayOpacity: 0.3, overlayColor: "#333", overlayClose: false, closeOnEscape: true });
		$('#trigger-project-input').click(function() {
			$('#project-input').trigger('openModal');
		});
	}
});