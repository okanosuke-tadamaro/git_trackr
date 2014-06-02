
var TaggableList = {
	
	changeToBlock: function() {
		// select the li containing the input tag (going to add each of the span tags before this)
		var inputListItem = $('input-list-item');

		// select content of the input form (all of this happens after the space bar event)
		var content = $('.taggable-list').val();

		// create new list item with span tag and content of the input form grabbed above 
		var listItem = $("li").add( "span" ).css( "background", "green" ).val(content);

		// insert the new list item before the text input li tag
		listItem.insertBefore(inputListItem);
	}
};