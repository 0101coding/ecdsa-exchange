const sha256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

function generateKey(){
   
    const key = ec.genKeyPair();
    let publicKeyHash =  sha256(key.getPublic().encode('hex')).toString();
    const address = `0x` + publicKeyHash.slice(publicKeyHash.length - 40);
    keyGenerated = {
        privateKey: key.getPrivate().toString(16),
        publicX: key.getPublic().x.toString(16),
        publicY: key.getPublic().y.toString(16),
        address
    }; 
    return keyGenerated;
}
 

function verifyMessage(publicX, publicY, signature, message){
  const pubKey = {
      x: publicX,
      y: publicY
  }
    const keyPair = ec.keyFromPublic(pubKey, 'hex');
    //console.dir( key);
   const msgHash = sha256(message).toString()
   return keyPair.verify(msgHash, signature);
}
 

module.exports = {
    generateKey,
    verifyMessage
}

