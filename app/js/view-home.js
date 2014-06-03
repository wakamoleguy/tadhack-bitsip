// view-home
(function () {
  var ENTER_KEY = 13;
  var ESCAPE_KEY = 27;

  var people = document.getElementById('people');
  var groups = document.getElementById('groups');
  var meetingButton = document.getElementById('meeting-create');

  var templateCache = {};

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

  function HomeView() {
    meetingButton.addEventListener('click', function () {
      this.onmeetingcreate && this.onmeetingcreate();
    }.bind(this), false);
  }

  HomeView.prototype = {
    createTarget: function (name, rate, isGroup) {
      function onActivate() {
        this.onactivate && this.onactivate(name);
      }

      var templateId = isGroup ? 'group-template' : 'person-template';
      var node = new Template(templateId, 'li', {
        name: name,
        rate: rate
      });

      node.addEventListener('click', onActivate.bind(this), false);

      (isGroup ? groups : people).appendChild(node);
    }
  };

  app.HomeView = HomeView;

}());