var AppRouter = Backbone.Router.extend({
	routes: {
		':username': 'index'
	},
	initialize: function() {
		console.log('router.js initialized');
		this.projectCollection = new ProjectCollection();
		this.projectCollectionView = new ProjectCollectionView({collection: this.projectCollection});
	},
	start: function() {
		Backbone.history.start();
	},
	index: function() {
		console.log('on index route');
		this.projectCollection.fetch({
			success: function() {
				console.log('fetched');
				$('#projects').html(this.projectCollectionView.$el);
			}.bind(this)
		});
	}
});