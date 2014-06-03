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
  function WinAtLife(name, paymentService, telcoService, homeView, callView) {
    this.moneyModel = paymentService;
    this.telcoModel = telcoService;
    this.homeView = homeView;

    // Wire stuff together now, please.
    this.homeView.onactivate = function (name) {
      console.log('Activated a thingy: ', name);
    };

    this.homeView.onmeetingcreate = function () {
      console.log('I should create a new meeting now, huh?');
    };

    // Initialize 'OnSIP' model
    this.telcoModel.ontarget = function (target) {
      this.homeView.createTarget(target.name, target.rate, target.isGroup);
    }.bind(this);

  }

  var wal = new WinAtLife('winatlife-tadhack'
                          ,new app.Bitcoin(SIP)
                          ,new app.OnSIP(SIP)
                          ,new app.HomeView()
                          //,new app.callView()
                         );

/*  function setView() {
    todo.controller.setView(document.location.hash);
  }*/

  app.wal = wal;

})();