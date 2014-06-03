// model-onsip
(function () {

  function OnSIP(SIP) {
    // Hack to trigger a create or two
    setTimeout(function () {
      if (this.ontarget) {
        this.ontarget({
          name: 'Rachie!',
          rate: 10.3,
          isGroup: false
        });
      }
    }.bind(this), 2000);
    setTimeout(function () {
      if (this.ontarget) {
        this.ontarget({
          name: 'Ivanhoes',
          rate: 123.7,
          isGroup: true
        });
      }
    }.bind(this), 5000);
  }


  app.OnSIP = OnSIP;
}());