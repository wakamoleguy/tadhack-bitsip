bitcoin = require('bitcoinjs-lib');

function Server(myWIF) {
  // FIXME: We shouldn't store private keys, if possible.
  this.myWIF = myWIF;
  this.myKey = bitcoin.ECKey.fromWIF(myWIF);
}

Server.prototype = {

  signRefundTx: function (hex, prevOutScript) {
    if (this.refundTx) {
      console.error('Refund transaction already created.  Abort!')
      return;
    }

    // Parse the hex into a Transaction object
    this.refundTx = bitcoin.Transaction.fromHex(hex);

    // Sign it.
    var refundHashForSigning = this.refundTx.hashForSignature(
      bitcoin.Script.fromASM(prevOutScript), 0, bitcoin.Transaction.SIGHASH_ALL
    );
    this.refundServerSignature = this.myKey.sign(refundHashForSigning);

    console.warn('PLEASE: send this to client for saveRefundServerSignature');
    console.warn(this.refundServerSignature.toDER().toJSON());
  }
};

exports.Server = Server;