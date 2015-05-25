(function (window, undefined) {

  var DOM = {
    window: window,
    document: window.document
  };

  var askesian = function() {
    return {
      init: function() {
        console.log("App is initialized");
      }
    }
  };

  window.Askesian = askesian();

  askesian.init();

}).call(this);