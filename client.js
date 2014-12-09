bitcoin = require('bitcoinjs-lib');

function Client(myWIF, theirPubKey) {
  this.myWIF = myWIF;
  this.myKey = bitcoin.ECKey.fromWIF(myWIF);
  this.theirPubKey = theirPubKey;
}

Client.prototype = {
  createPoolTx: function (prevTx, prevTxIdx, prevTxWIF, amt) {
    if (this.poolTx) {
      console.error('Pool transaction already created.  Abort!')
      return;
    }

    // Create a new transaction to fund the pool.
    this.poolTx = new bitcoin.Transaction();

    // The pool is funded by the client:
    this.poolTx.addInput(prevTx, prevTxIdx);

    // The output goes to 2-of-2 pool shared by the client and server.
    var outputScript =
      bitcoin.scripts.multisigOutput(2, [this.myKey.pub, this.theirPubKey]);

    // Subtract the default fee.
    this.poolAmt = amt - 10000;
    this.poolTx.addOutput(outputScript, this.poolAmt);

    // Sign the input (unfortunately need to know previous private key).
    this.poolTx.sign(0, bitcoin.ECKey.fromWIF(prevTxWIF));

    console.log('Pool transaction created: ' + this.poolAmt + ' satoshis');
  },

  createRefundTx: function (refundAddress, locktime) {
    if (this.refundTx) {
      console.error('Refund transaction already created.  Abort!')
      return;
    }

    // Create a new transaction funded by the pool.
    this.refundTx = new bitcoin.Transaction();
    this.refundTx.addInput(this.poolTx.getId(), 0);

    // The output goes to me!
    this.refundAmt = this.poolAmt - 10000;
    this.refundTx.addOutput(refundAddress, this.refundAmt);

    // Lock it for a while.
    this.refundTx.locktime = locktime;

    // Sign the refund Transaction while we are here
    var refundHashForSigning = this.refundTx.hashForSignature(
      this.poolTx.outs[0].script, 0, bitcoin.Transaction.SIGHASH_ALL
    );
    this.refundClientSignature = this.myKey.sign(refundHashForSigning);

    // Send the hash to the Server for signing.
    console.warn('PLEASE: send this to server for signRefundTx');
    console.warn('Hex:', this.refundTx.toHex());
    console.warn('PrevOut:', this.refundTx.outs[0].script.toASM());
  },

  saveRefundServerSignature: function (sigJSON) {
    // TODO: VERIFY!
    // FIXME: Some type issues here, probably.  Can sig be a hex string?
    this.refundServerSignature = bitcoin.ECSignature.fromDER(new Buffer(JSON.parse(sigJSON)));
  },

  spendRefundTransaction: function () {
    var script = bitcoin.scripts.multisigInput([
      this.refundClientSignature.toScriptSignature(
        bitcoin.Transaction.SIGHASH_ALL),
      this.refundServerSignature.toScriptSignature(
        bitcoin.Transaction.SIGHASH_ALL)
    ]);

    this.refundTx.setInputScript(0, script);

    this.broadcast(this.refundTx);
  },

  broadcast: function (tx) {
    // TODO: Uh...actually broadcast?

    console.warn('PLEASE: Broadcast this to the network for me:');
    console.warn(tx.toHex());
  }
};

exports.Client = Client;
