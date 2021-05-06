'use strict';

const { FileSystemWallet, InMemoryWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');

//connect to the config file
const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;

let gatewayDiscovery = config.gatewayDiscovery;
let appAdmin = config.appAdmin;
let orgMSPID = config.orgMSPID;

const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);


const util = require('util');


exports.registerUser = async function (userId) {

  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const adminWallet = new FileSystemWallet(walletPath);

    const adminExists = await adminWallet.exists(appAdmin);

    if (!adminExists) {
      return {
        error: `An identity for the admin user ${appAdmin} does not exist in the AdminWallet. 
        Run the enrollAdmin.js application before retrying`
      };
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { adminWallet, identity: appAdmin, discovery: gatewayDiscovery });

    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    const secret = await ca.register({ affiliation: '', enrollmentID: userId, role: 'client' }, adminIdentity);

    const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: secret });
    let response = {certificate: enrollment.certificate, privateKey: enrollment.key, orgMSPID: orgMSPID}
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${userId} + : ${error}`);
    return {error: error};
  }
};