import express from 'express';
let network = require('./fabric/network.js');
var bodyParser = require('body-parser')



const app = express();
const port = 3000;


app.use(bodyParser.json())

app.post('/registerUser', async (req, res) => {
  console.log(req.body);
  let userId = req.body.userId;
  if (!userId){
    return res.send("Missing userId parameter")
  }

  let response = await network.registerUser(userId);

  if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});