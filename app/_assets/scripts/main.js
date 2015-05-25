(function (undefined) {
  var self = this;

  var DOM = {
    window: self,
    document: self.document
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