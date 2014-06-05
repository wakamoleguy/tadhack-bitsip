// model-onsip
(function () {
  var DISCO = 'disco@disuo.onsip.com';

  var targets = {};

  function OnSIP(SIP) {
    var onsip = this;

    this.disco = new SIP.UA({
      uri: DISCO,
      traceSip: true
    });

    this.disco.
      on('message', function (message) {
        var body = JSON.parse(message.body);
        if (body.ask) {
          if (onsip.ua) {
            onsip.ua.message(DISCO, JSON.stringify({
              name: 'My Name',
              rate: 0.2,
              isGroup: false,
              address: onsip.address
            }));
          }
        } else if (onsip.ontarget) {
          onsip.ontarget(body);
        }
      }).
      message(DISCO, '{"ask":true}');

    // Hack to trigger a create one or two targets
    setTimeout(function () {
      if (this.ontarget) {
        this.ontarget({
          name: 'Rachie!',
          rate: 10.3,
          isGroup: false,
          address: 'rachel@disuo.onsip.com'
        });
      }
    }.bind(this), 2000);
    setTimeout(function () {
      if (this.ontarget) {
        this.ontarget({
          name: 'Ivanhoes',
          rate: 123.7,
          isGroup: true,
          address: 'ivanhoes@disuo.onsip.com'
        });
      }
    }.bind(this), 5000);
  }

  OnSIP.prototype = {
    invite: function (name) {
      this.ua.invite(name);
    },

    register: function (name, address, rate, isGroup) {
      this.isGroup = isGroup;
      this.rate = rate;
      this.address = address;

      this.ua = new SIP.UA({
        traceSip: true,
        uri: address,
        displayName: name
      });
      this.ua.message(DISCO, JSON.stringify({
        name: name,
        address: address,
        rate: rate,
        isGroup: isGroup
      }));
    }
  };


  app.OnSIP = OnSIP;
}());