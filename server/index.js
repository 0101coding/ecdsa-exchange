const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const {generateKey, validatePrivateKey, verifyMessage } = require("./keyManager");

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const key = generateKey();
console.log(key)
const key1 = generateKey();
console.log(key1);

let balances = {};
let private = {};

for(let i=0; i< 3; i++){
  let key = generateKey();
  balances[key.address] = {
    balance: 100,
    publicX: key.publicX,
    publicY: key.publicY
  };
  private[key.address] = key.privateKey

  //let validated = validatePrivateKey(key.privateKey, key.address);
  //console.log(validated)
}

/*
//Testing
let pKey = "46203c7a876c927551b7986b4c152ef39e8708638476c40b1544a594b2f91ed9";
let signature = {
    r: "a472d97d4c855de4ffe43f73af993800e7ec7d1833e7782c58776783193cdda1",
    s: "d57c3ba2f9f4f8d8655614669289881832ab885c8098c47b1af06a6de6cf6795",
    recoveryParam: 1
};
let amount = "20";
let r = verifyMessage(pKey, signature, amount);
console.log(r);
 */

console.log(balances);
console.log(private);

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address].balance || 0;
  res.send({ balance });
});

//method 1. send the Data, but confirm that the address Matches the private key
app.post('/send', (req, res) => {
  const {sender, recipient, amount, signature } = req.body;
  let publicX = balances[sender].publicX;
  let publicY = balances[sender].publicY;
  if (verifyMessage(publicX, publicY, signature, amount) == false){
    res.send({ error: "Provided Key is invalid"})
    res.end()
  } else{
    balances[sender].balance -= amount;
    balances[recipient].balance = (balances[recipient] || 0) + +amount;
    res.send({ balance: balances[sender].balance });
  }
});

 

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
