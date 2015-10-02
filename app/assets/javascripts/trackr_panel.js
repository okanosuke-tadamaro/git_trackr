var Tracker = Tracker || {};

Trackr.Panel = {

  initialize: function() {
    $(document).on('click', '.panelTrigger', this.togglePanel);
    $(document).on('click', '.closePanel', this.closePanel);
  },

  togglePanel: function(e) {
    e.preventDefault();
    var visiblePanels = $('.panel.shown');
    for (var i = 0; i < visiblePanels.length; i++) {
      var visiblePanel = visiblePanels.eq(i);
      visiblePanel.removeClass('shown').addClass('hidden');
    }
    var targetPanel = $(e.target).data('target');
    var panel = $(targetPanel);
    if (panel.length) {
      panel.removeClass('hidden').addClass('shown');
    }
  },

  closePanel: function(e) {
    var panel = $('.panel.shown');
    panel.removeClass('shown').addClass('hidden');
  }

}
