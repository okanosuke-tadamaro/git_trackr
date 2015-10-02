var Tracker = Tracker || {};

Trackr.Dropdown = {

  initialize: function() {
    var dropdowns = $('ul.dropdown');
    for (var i = 0; i < dropdowns.length; i++) {
      var dropdown = dropdowns.eq(i);
      var parent = dropdown.parent();
      var parentLink = parent.find('a');
      var arrow = $('<i class="fa fa-angle-down">').css({'margin-left': '5px'});
      parentLink.addClass('has-dropdown');
      parentLink.append(arrow);
    }
    $(document).on('click', '.has-dropdown', this.showDropdown);
  },

  showDropdown: function(e) {
    $(e.target).parent().find('ul.dropdown').toggle();
  }

}
