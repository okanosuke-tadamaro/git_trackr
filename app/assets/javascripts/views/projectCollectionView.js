var ProjectCollectionView = Backbone.View.extend({

	tagName: 'ul',
	className: 'project-list',
	initialize: function() {
		console.log('collectionview is initialized');
		this.listenTo(this.collection, 'add', this.addOne);
		this.listenTo(this.collection, 'reset', this.addAll);
	},
	addAll: function() {
		console.log('addAll is hit');
		this.$el.empty();
		this.collection.each(this.addOne, this);
	},
	addOne: function(projectModel) {
		console.log('addOne is hit');
		var projectItemView = new ProjectItemView({model: projectModel});
		this.$el.append(projectItemView.$el);
	}

});