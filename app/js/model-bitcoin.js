// model-bitcoin
(function () {

  var privateKey;

  var unspentTransactions = [];

  function connect() {
    this.session = this.ua.invite('will.2@disuo.onsip.com');
    this.session.
      on('failed', setTimeout.bind(null, connect.bind(this), 5000)).
      on('accepted', function () {
        if (this.onconnect) {
          this.onconnect();
        }
      });
  }

  function BitcoinModel(SIP) {
    var bcm = this;

    this.ua = new SIP.UA({
      register: false,
      traceSip: true,
      mediaHandlerFactory: function (session, options) {
        var self = Object.create(new SIP.WebRTC.MediaHandler(session, options));

        self.getDescription = function (success, failure, hint) {
          self.session.connecting();
          self.dataChannel = self.peerConnection.createDataChannel('sipjs');
          self.dataChannel.onmessage = bcm.onmessage();
          self.createOfferOrAnswer(success, failure);
        };
        return self;
      }
    });

    privateKey || (privateKey = Bitcoin.ECKey.makeRandom());

    connect.call(this);
  }

  BitcoinModel.prototype = {
    createTx: function () {
      // Make a private key
      var key = Bitcoin.ECKey.makeRandom();

      console.log('Private key: ', key.toWIF());
      console.log('Public key: ', key.pub.getAddress().toString());
      debugger;
    },

    setUp: function (rate, telco) {
      // Set up the pool
      console.log('I would get a bitcoin pool ready here');
    },
    
    update: function (rate, telco) {
      // Create a new updated transaction from the pool.
      console.log('I would send or receive an updated rate here.');
    },

    settle: function (telco) {
      // Send off the last payment
      console.log('I would settle up here.');
    },

    onmessage: function (message) {
      console.log('got data channel message: ', message);
    }
  };

  app.Bitcoin = BitcoinModel;

}());