// model-onsip
(function () {
  var DISCO = 'disco2@disuo.onsip.com';

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
              name: this.name,
              rate: this.rate,
              isGroup: this.isGroup,
              address: this.address
            }));
          }
        } else if (onsip.ontarget) {
          onsip.ontarget(body);
        }
      }.bind(this)).
      message(DISCO, '{"ask":true}');

    // Hack to trigger a create one or two targets
    setTimeout(function () {
      if (this.ontarget) {
        this.ontarget({
          name: 'Welcome!',
          rate: 0,
          isGroup: false,
          address: 'welcome@junctionnetworks.com'
        });
      }
    }.bind(this), 100);
    setTimeout(function () {
      if (this.ontarget) {
        this.ontarget({
          name: 'OnSIP Developers',
          rate: 0,
          isGroup: true,
          address: 'will@junctionnetworks.com'
        });
      }
    }.bind(this), 200);
  }

  OnSIP.prototype = {
    invite: function (address) {
      var onsip = this;
      return session = new SIP.UA({
        traceSip: true,
        mediaHandlerFactory: function (session, options) {
          var self = Object.create(new SIP.WebRTC.MediaHandler(session, options));

          self.addStream = function (stream, onSuccess, onFailure, constraints) {
            try {
              this.peerConnection.addStream(stream, constraints);
              if (this.hasOffer('remote')) {
                this.peerConnection.ondatachannel = function (evt) {
                  self.dataChannel = evt.channel;
                  self.dataChannel.onmessage = onsip.onmessage;
                };
              } else {
                self.dataChannel = this.peerConnection.createDataChannel('sipjs');
                self.dataChannel.onmessage = onsip.onmessage;
              }
            } catch(e) {
              this.logger.error('error adding stream');
              this.logger.error(e);
              onFailure(e);
              return;
          }

            onSuccess();
          };
          return self;
        }
      }).invite(address);
    },

    terminate: function () {
      if (session) {
        session.terminate();
        session = null;
      }
    },

    onmessage: function (evt) {
      console.log(evt);
    },

    register: function (name, address, rate, isGroup) {
      var onsip = this;
      this.isGroup = isGroup;
      this.rate = rate;
      this.address = address;
      this.name = name;

      this.ua = new SIP.UA({
        traceSip: true,
        uri: address,
        displayName: name,
        mediaHandlerFactory: function (session, options) {
          var self = Object.create(new SIP.WebRTC.MediaHandler(session, options));

          self.addStream = function (stream, onSuccess, onFailure, constraints) {
            try {
              this.peerConnection.addStream(stream, constraints);
              if (this.hasOffer('remote')) {
                this.peerConnection.ondatachannel = function (evt) {
                  self.dataChannel = evt.channel;
                  self.dataChannel.onmessage = onsip.onmessage;
                };
              } else {
                self.dataChannel = this.peerConnection.createDataChannel('sipjs');
                self.dataChannel.onmessage = onsip.onmessage;
              }
            } catch(e) {
              this.logger.error('error adding stream');
              this.logger.error(e);
              onFailure(e);
              return;
          }

            onSuccess();
          };
          return self;
        }
      });
      this.ua.on('invite', function (session) {
        console.log('got invite');
        this.session = window.session = session;
        this.session.data.rate = this.rate;
        if (this.oninvite) {
          this.oninvite(session);
        }
        var inter = window.setInterval(function () {
          try {
            this.session.mediaHandler.dataChannel.send(JSON.stringify({
              type: 'rate',
              amount: this.rate
            }));

            window.clearInterval(inter);
          } catch(e) {

          }
        }.bind(this), 1000);
      }.bind(this));
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