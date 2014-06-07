// view-call
(function () {
  var INTERVAL = 1;

  var video = document.getElementById('remote-stream');
  var bigRedButton = document.getElementById('terminate');
  var balance = document.getElementById('total-balance');
  var callBalance = document.getElementById('call-balance');
  var paymentForm = document.getElementById('call-info');
  var paymentRequestAmount = document.getElementById('btc-input');
  var rate = document.getElementById('btc-rate');
  var b = 100;
  var c = 0;
  var r = 0;
  var rateInterval = 0;

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
    bigRedButton.addEventListener('click', function () {
      console.log('clicking a big red button');
      if (this.onterminate) {
        this.onterminate();
      }
    }.bind(this), false);

    paymentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (this.moneyrequested) {
        this.moneyrequested(parseInt(paymentRequestAmount.value, 10));
      }
      paymentRequestAmount.value = '';
    }.bind(this), false);
  }

  CallView.prototype = {
    init: function (session) {
      video.src = '';
      video.pause();
      c = 0;
      callBalance.innerHTML = 0;
      rate.innerHTML = session.data.rate + ' BTC/min';
    },
    callAccepted: function (session) {
      video.src = URL.createObjectURL(session.getRemoteStreams()[0]);
      video.play();
    },

    requestMoney: function (amount) {
      var result = confirm('Money Requested. Send ' + amount + 'BTC?');

      if (result) {
        b -= amount;
        balance.innerHTML = b;
        c -= amount;
        callBalance.innerHTML = c;

        this.onpay(amount);
      }
    },

    updateMoney: function (amount) {
      b += amount;
      balance.innerHTML = b;
      c += amount;
      callBalance.innerHTML = c + ' BTC';
    },

    updateRate: function (amount) {
      r = amount;
      rate.innerHTML = r + ' BTC/min';
      if (rateInterval) {
        window.clearInterval(rateInterval);
      }
      rateInterval = window.setInterval(function () {
        var value = r / 60 * INTERVAL;
        if (this.onpay) {
          this.onpay(value);

          b -= value;
          balance.innerHTML = b;
          c -= value;
          callBalance.innerHTML = c;
        }
      }.bind(this), INTERVAL * 1000);
    }

  };

  app.CallView = CallView;

}());