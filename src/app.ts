import express from 'express';
import { enrollAdmin } from './connection/EnrollAdmin';
import { FabricNetworkConnection } from './fabric/network';
import { registerUserHandler } from './routes/RegisterUserHandler';
import { revokeUserHandler } from './routes/RevokeUserHandler';
var bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

app.post('/registerUser', registerUserHandler);

app.post('/revokeUser', revokeUserHandler);

app.listen(port, () => {
  const fabricNetwork = FabricNetworkConnection.getInstance();
  fabricNetwork.init();
  enrollAdmin();
  return console.log(`Hyperledger Register Service is listening on ${port}`);
});