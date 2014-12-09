global.WebSocket = require('ws');
SIP = require('sip.js');
bitcore = require('bitcore');


var ua = new SIP.UA({
  traceSip: true,
  uri: 'bitcoin@disuo.onsip.com'
});

var peerman = new bitcore.PeerManager({
  network: 'testnet'
});

peerman.on('connection', function (conn) {

  function handleMessage(message) {
    var body = JSON.parse(message.body);
    var txHex;
    if (body.type === 'tx') {
      txHex = body.tx;

      conn.sendMessage('tx', new Buffer(body.tx, 'hex'));
    }
  }

  console.log('setting up...');
  ua.on('message', handleMessage);
  conn.on('disconnect', ua.off.bind(ua, 'message', handleMessage));
  console.log('done!');
});

peerman.addPeer(new bitcore.Peer('127.0.0.1', 18333));
peerman.start();
