var ASKESIAN = (function () {

  // hold instance of ASKESIAN
  var instance;

  // DOM element cache for major elements
  var DOM = {
    window: window,
    document: window.document
  };

  var eventLookup = {};

  function init() {
    console.log('App is initialized');
    this.name = "ASKESIAN";

    return this;
  }

  function bindEventFor (target, evt, fn) {
    if (!target && !evt) {
      return;
    }

    if (target.addEventListener) {
      target.addEventListener(evt, fn, false);
    } else {
      target.attachEvent(evt, fn);
    }

    eventLookup[target] =  eventLookup[target] || {
      events: []
    };

    eventLookup[target].events.push({event: evt, fn: fn});

    return target;
  }

  function getEventHandlersFor (target) {
    return eventLookup[target];
  }

  return {

    getInstance: function () {
      if (!instance) {
        instance = init.call(this);
      }

      return instance;
    },

    addEvent:  bindEventFor,

    getEvents: getEventHandlersFor

  };

})();

ASKESIAN.getInstance();

