/*
 *
 * WebRTC/SIP.js Init
 *
 */
global.WebSocket = require('ws');
var WebRTC = require('wrtc');

global.RTCIceCandidate = WebRTC.RTCIceCandidate;
global.RTCPeerConnection = WebRTC.RTCPeerConnection;
global.RTCSessionDescription = WebRTC.RTCSessionDescription;
global.navigator = {
  getUserMedia: function (constraints, success, failure) {
    setTimeout(failure, 0);
  }
};

var SIP = require('./sip.js');

SIP.WebRTC.MediaStream = function () {};

function MediaHandlerFactory(session, options) {
  var self = new SIP.WebRTC.MediaHandler(session, options);

  self.getDescription = function (success, failure, hint) {
    self.session.connecting();
    if (self.hasOffer('remote')) {
      self.peerConnection.ondatachannel = function (evt) {
        self.dataChannel = evt.channel;
        self.dataChannel.onmessage = function (e) {
          console.log('Data Channel received message: ', e.data);
          var parsed = JSON.parse(e.data);

          if (parsed.command === 'createTx') {
            createTx(parsed);
          }

        };
      };
    }
    self.createOfferOrAnswer(success, failure);
  };

  self.unmute = function () {};
  return self;
};

var ua = new SIP.UA({
  traceSip: true,
  uri: 'will.2@disuo.onsip.com',
  mediaHandlerFactory: MediaHandlerFactory
});


/*
 *
 * BitCoin Init
 *
 */
var bitcore = require('bitcore');

var networks = bitcore.networks;
var Peer = bitcore.Peer;
var PeerManager = bitcore.PeerManager
var TransactionBuilder = bitcore.TransactionBuilder;
var util = bitcore.util;

var handleBlock = function (info) {
  for (var i in ua.sessions) {
    ua.sessions[i].mediaHandler.dataChannel.send('block: ' + JSON.stringify(info.message));
  }
};

var handleTx = function(info) {
  var tx = info.message.tx.getStandardizedObject();

  console.log('*** GOT TRANSACTION ***');
  console.log(info.message);
  console.log('*** END TRANSACTION ***');
  for (var i in ua.sessions) {
    ua.sessions[i].mediaHandler.dataChannel.send('tx: ' + JSON.stringify(info.message));
  }
};

var handleInv = function(info) {
  var invs = info.message.invs;
  info.conn.sendGetData(invs);

  for (var i in ua.sessions) {
    ua.sessions[i].mediaHandler.dataChannel.send('inv: ' + JSON.stringify(info.message));
  }
};

var peerman = new PeerManager({
  network: 'testnet'
});

peerman.addPeer(new Peer('127.0.0.1', 18333));

peerman.on('connection', function(conn) {
  global.conn = conn;
  conn.on('inv', handleInv);
  conn.on('block', handleBlock);
  conn.on('tx', handleTx);
  conn.on('disconnect', function (err) {
    console.log(err);
  });
});

peerman.start();

/*
 *
 * UA
 *
 */


/** Tie Sessions to bitcoin events, and vise versa **/
ua.on('invite', function (session) {
  session.accept();
});

/** BitCoin functions **/
var unspent = [{
  

}];

function createTx(parsed) {

  var opts = {
    remainderOut: {
      address: 'mizqLFZiihyy5qcu1CyYkeziUtibLJEBxu'
    }
  };

  var tx = new TransactionBuilder(opts).
    setUnspent(parsed.unspent).
    setOutputs(parsed.outs).
    sign(keys).
    build();
}

global.createTx = createTx;

var Buffers = require('buffers');

global.sendRawTx = function (raw) {
/*  var buffer = bitcore.base58.encode(raw.
    match(/.{2}/g).
    map(function (val) {
      return parseInt(val, 16);
    }));
*/

  var buffer = new Buffer(raw.
    match(/.{2}/g).
    map(function (hex) {
      return parseInt(hex, 16);
    }));
  console.log(buffer);
  var tx = new bitcore.Transaction();
  tx.parse(new bitcore.BinaryParser(buffer));
  console.log(tx);

  console.log(tx.serialize().toString('hex'));

  conn && conn.sendTx(tx);
}