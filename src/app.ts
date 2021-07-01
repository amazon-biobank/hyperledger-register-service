import express from 'express';
let network = require('./fabric/network.js');
var bodyParser = require('body-parser')



const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json())

app.post('/registerUser', async (req, res) => {
  console.log(req.body);
  let userId = req.body.userId;
  if (!userId){
    return res.send("Missing userId parameter")
  }

  let response = await network.registerUser(userId);

  if (response.error) {
    res.status(500).send(response.error);
  } else {
    res.send(response);
  }
});

app.post('/revokeUser', async (req, res) => {
  console.log(req.body);
  let userId = req.body.userId;
  if (!userId){
    return res.send("Missing userId parameter")
  }

  let response = await network.revokeUser(userId);

  if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

app.listen(port, () => {
  return console.log(`Hyperledger Register Service is listening on ${port}`);
});