(function () {
  'use strict';

  /**
   * Sets up a new WinAtLife client
   *
   * @param {String} name The name of your new WinAtLife client.
   * @param {} paymentService The payment API to use (e.g., BitCoin)
   * @param {} telcoService The communications service to use (e.g., SIP.js)
   * @param {} callView The View to use during a call
   * @param {} homeView The View to use before and after calls
   */
  function WinAtLife(name, models, views) {

    this.moneyModel = models.money;
    this.telcoModel = models.telco;
    this.homeView = views.home;
    this.walletView = views.wallet;

    // Wire stuff together now, please.
    this.homeView.onactivate = function (name) {
      console.log('Activated a thingy: ', name);
    };

    this.homeView.onregistersubmit = function (name, address, rate, isGroup) {
      this.telcoModel.register(name, address, rate, isGroup);
    }.bind(this);

    // Initialize 'OnSIP' model
    this.telcoModel.ontarget = function (target) {
      this.homeView.createTarget(target.name, target.rate, target.isGroup);
    }.bind(this);

    // Initialize 'Bitcoin' model
    this.moneyModel.onconnect = function () {
      this.homeView.alertMoney();
    }

  }

  var wal = new WinAtLife('winatlife-tadhack', {
    money: new app.Bitcoin(SIP),
    telco: new app.OnSIP(SIP)
  }, {
    home: new app.HomeView(),
    wallet: new app.WalletView()
  });

/*  function setView() {
    todo.controller.setView(document.location.hash);
  }*/

  app.wal = wal;

})();