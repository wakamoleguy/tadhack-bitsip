var Client = exports.client = require('./client.js').Client;
var Server = exports.server = require('./server.js').Server;
var bitcoin = require('bitcoinjs-lib');

var C = exports.C = {
  clientWIF: 'cTPrvvRoVxKbYgaEhs4WDC2Ea5GEZdCswkfuFui5KHUG3WLxB2PF',
  serverWIF: 'cPY9wCwAVncPs4oSPszj22JL4cxf2mjVx26C2FcDqePbt9yz4DKt',

  prevTx: 'f8651a440ba481e7e378fa416d3dbd03b0971784f04ac175aa2fb265bb39a572',
  prevTxIdx: 1,
  amt: '200090000',
  prevTxWIF: 'cTPrvvRoVxKbYgaEhs4WDC2Ea5GEZdCswkfuFui5KHUG3WLxB2PF',

  refundAddr: 'mw3c8h931yzJpeY1ZCJDnY5f3dXS1erLxp',
  serverRefundAddr: 'moGT3X7fSi69Ee7UukvhKxuQRDvC8GSyK1',
  locktime: '0'
};

var server, client;

exports.go = function () {
  console.warn('Initiating Server...Done');
  server = exports.server = new Server(C.serverWIF);
  console.warn('Initiating Client...Done');
  client = exports.client = new Client(C.clientWIF, server.myKey.pub);

  console.warn('Beginning Session...');


  console.warn('Creating pool with', C.amt);
  client.createPoolTx(C.prevTx, C.prevTxIdx, C.prevTxWIF, C.amt);

  console.warn('Creating refund tx to', C.refundAddr, 'at/after', C.locktime);
  client.createRefundTx(C.refundAddr, C.locktime);
}
