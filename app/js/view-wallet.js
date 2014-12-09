// view-wallet
(function () {

  var wallet = document.getElementById('wallet');
  var balance = document.getElementById('balance');

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

  function WalletView() {
    this.isWalletOpen = false;

    balance.addEventListener('click', function () {
      balance.blur();
      if (this.isWalletOpen) {
        this.walletClose();
      } else {
        this.walletOpen();
      }
    }.bind(this), false);
  }

  WalletView.prototype = {
    walletOpen: function () {
      wallet.classList.add('open');
      this.isWalletOpen = true;
    },

    walletClose: function () {
      wallet.classList.remove('open');
      this.isWalletOpen = false;
    }
  };

  app.WalletView = WalletView;

}());