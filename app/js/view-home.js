// view-home
(function () {
  var ENTER_KEY = 13;
  var ESCAPE_KEY = 27;

  var people = document.getElementById('people');
  var groups = document.getElementById('groups');
  var registerForm = document.querySelector('#register form');
  var registerName = document.getElementById('register-name');
  var registerRate = document.getElementById('register-rate');
  var registerIsGroup = document.getElementById('register-isgroup');


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
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      this.onregistersubmit && this.onregistersubmit(
        registerName.value,
        encodeURIComponent(registerName.value) + '@disuo.onsip.com',
        registerRate.value,
        registerIsGroup.checked
      );

      registerName.value = registerRate.value = '';
    }.bind(this), false);
  }

  HomeView.prototype = {
    createTarget: function (name, rate, isGroup) {
      function onActivate() {
        this.onactivate && this.onactivate(name);
      }

      if (document.querySelector('[data-name="' + name + '"]')) return;

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