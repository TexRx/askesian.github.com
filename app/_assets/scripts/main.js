(function (win, doc, undefined) {

  var app = function() {
    return {
      init: function() {
        console.log("App is initialized");
      }
    }
  };

  window.App = app();

}).call(this);