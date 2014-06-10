var TaggableList = {
	
	changeToBlock: function() {	
		// select the li containing the input tag (going to add each of the span tags before this)
		var inputListItem = $('.input-list-item');

		// select content of the input form (all of this happens after the space bar event)
		var content = $('.taggable-list').find('input');

		// create new list item with span tag and content of the input form grabbed above
		var newListItem = $('<li>').addClass('tagged-list-item');
		var newSpan = $('<span>');
		var deleteButton = $('<span>').addClass('delete-button').text('x');
		newSpan.addClass('tagged').text(content.val());
		newSpan.appendTo(newListItem);
		deleteButton.appendTo(newListItem);
		deleteButton.click(function() {
			this.parentNode.remove();
		});
		// var listItem = $("li").add( "span" ).addClass('tagged').val(content.val());

		// insert the new list item before the text input li tag
		newListItem.insertBefore(inputListItem);
		content.val('');
	}
};