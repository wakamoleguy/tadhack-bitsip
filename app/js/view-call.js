// view-call
(function () {

  function Template(id, tag, params) {
    var template = templateCache[id] ||
      (templateCache[id] = document.getElementById(id));

    var node = document.createElement(tag);

    var key;

    node.innerHTML = template.innerHTML;

    for (key in params) {
      node.dataset[key] = params[key];
      node.querySelector('.' + key).innerHTML = params[key];
    }

    return node;
  }

  function CallView() {
  }

  CallView.prototype = {};

  app.CallView = CallView;

}());