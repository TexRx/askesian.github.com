(function(window, document, undefined) {
  var pageLinks = document.getElementsByTagName('a');
  var loc = window.location;

  // handling visited links
  // http://joelcalifa.com/blog/revisiting-visited
  localStorage.setItem('visited-' + loc.pathname, true);

  for (i = 0, len = pageLinks.length; i < len; i++) {
    var link = pageLinks[i];
    var pathName = link.pathname.substr(-1) !== '/' ? link.pathname + '/' : link.pathname;

    if (link.host === loc.host && localStorage.getItem('visited-' + pathName)) {
      link.dataset.visited = true;
    }
  }
}(window, document));