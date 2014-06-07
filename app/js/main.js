(function () {
  'use strict';

  function terminateSession() {
    var html = document.documentElement.classList;
    html.contains('in-call') ? html.remove('in-call') : html.add('in-call');
  }

  function sessionListeners(wal, session) {
    session.on('accepted', function () {
      wal.callView.callAccepted(session);
    });

    session.on('failed', terminateSession);
    session.on('bye', terminateSession);
  }


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
    this.callView = views.call;

    // Wire stuff together now, please.
    this.homeView.onactivate = function (dataset) {
      console.log('Activated a thingy: ', dataset);
      var html = document.documentElement.classList;
      html.contains('in-call') ? html.remove('in-call') : html.add('in-call');

      this.session = this.telcoModel.invite(dataset.address);
      sessionListeners(this, session);
    }.bind(this);

    this.homeView.onregistersubmit = function (name, address, rate, isGroup) {
      this.telcoModel.register(name, address, rate, isGroup);
    }.bind(this);

    // Initialize 'OnSIP' model
    this.telcoModel.ontarget = function (target) {
      this.homeView.createTarget(target.name, target.rate, target.address, target.isGroup);
    }.bind(this);

    this.telcoModel.oninvite = function (session) {
      this.session = session;
      terminateSession();
      this.callView.init(session);

      sessionListeners(this, session);
      session.accept();
    }.bind(this);

    // Initialize 'Bitcoin' model
    this.moneyModel.onconnect = function () {
      this.homeView.alertMoney();
    }

    this.callView.onterminate = function () {
      this.telcoModel.terminate();
      delete this.session;
      terminateSession();
    }.bind(this);

    this.callView.moneyrequested = function (amount) {
      try {
        this.session.mediaHandler.dataChannel.send(JSON.stringify({
          type: 'request',
          amount: amount
        }));
      } catch (e) {

      }
    }.bind(this);

    this.callView.onpay = function (amount) {
      try {
        this.session.mediaHandler.dataChannel.send(JSON.stringify({
          type: 'update',
          amount: amount
        }));
      } catch(e) {

      }
    }.bind(this);

    this.telcoModel.onmessage = function (evt) {
      var data = JSON.parse(evt.data);
      switch (data.type) {
      case 'rate':
        this.callView.updateRate(data.amount);
        break;
      case 'request':
        this.callView.requestMoney(data.amount);
        break;
      case 'payment':
        debugger;
      case 'update':
        this.callView.updateMoney(data.amount);
        break;
      default:
        console.log(evt.data);
        break;
      }
    }.bind(this);

  }

  var wal = new WinAtLife('winatlife-tadhack', {
    money: new app.Bitcoin(SIP),
    telco: new app.OnSIP(SIP)
  }, {
    home: new app.HomeView(),
    wallet: new app.WalletView(),
    call: new app.CallView()
  });

/*  function setView() {
    todo.controller.setView(document.location.hash);
  }*/

  app.wal = wal;

})();