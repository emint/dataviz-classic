// This module is the view of multiple maps side-by-side. It also holds the
// button for defining a new map.
define(['jquery-ui', 'backbone', 'data_module', 'map_config_dialog', 
  'map_comparison_model'], 
    function($, Backbone, dataModule, mapConfigDialogFactory, 
      mapComparisonModelEditor) {
  var mapComparisonView = Backbone.View.extend( {
    
    buttonId: "defineViewButton",
    savedMapsId: "savedMaps",

    events: {},

    initialize: function(options) {
      _.bindAll(this, 'render', 'newMap', 'addMap');
      this.render();
      mapComparisonModelEditor.collection.bind('add', this.addMap);
      mapComparisonModelEditor.collection.bind('remove', this.removeMap);
    },

    addMap: function(map) {
      var newMap = map.attributes.mapDialogRef.getMapPic();
        
      newMap
        .attr("class", "savedMap")
        .attr("id", "map" + map.attributes.mapDialogRef.model.get("modelNum"));

      $("svg", newMap)
        .attr("width", 600)
        .attr("height", 400)
        .on("click", function() {
          map.attributes.mapDialogRef.openDialog();
        });

      $("#" + this.savedMapsId)
        .append(newMap);
    },

    removeMap: function(map) {
      console.log("Removing map");
      $("#map" + map.attributes.mapDialogRef.model.get("modelNum"))
        .remove();
    },

    // Adds the button to open dialog for defining a new map
    render: function() {
      $(this.el).append("<button id=\"" + this.buttonId + "\">" + 
        "New Map</button>");
      $(this.el).find("#" + this.buttonId).button();
      this.events['click button#' + this.buttonId] = 'newMap';

      $(this.el).append("<div id=\"" + this.savedMapsId + "\"></div>");
    },

    newMap: function() {
      // Creates a new dialog with an associated model
      // TODO Ensure any dialogs already open are cleared
      this.mapConfigDialog = mapConfigDialogFactory(this.el);

      this.mapConfigDialog.openDialog();
    }    
  }); 

  return function() {
    return new mapComparisonView();
  }
});