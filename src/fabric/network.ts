'use strict';

import { Wallets, Gateway } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';

const path = require('path');
const fs = require('fs');

//connect to the config file
const configPath = path.join(process.cwd(), './src/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
let gatewayDiscovery = config.gatewayDiscovery;
let appAdmin = config.appAdmin;
let orgKey = config.orgKey;

const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const organizationConfig = ccp.organizations[orgKey];
const caKey = organizationConfig.certificateAuthorities[0];

const caURL = ccp.certificateAuthorities[caKey].url;
const ca = new FabricCAServices(caURL);

const registerUser = async function (userId) {

  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);


    const adminIdentity = await wallet.get(appAdmin);
    if (!adminIdentity) {
      return {
        error: `An identity for the admin user ${appAdmin} does not exist in the wallet. 
        Run the src/enrollAdmin.js application before retrying`
      };
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet: wallet, identity: appAdmin, discovery: gatewayDiscovery });

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    const user = { affiliation: 'org1', enrollmentID: userId, role: 'client' };
    const secret = await ca.register(user, adminUser);
    const enrollRequest = { enrollmentID: userId, enrollmentSecret: secret };
    const enrollment = await ca.enroll(enrollRequest);
  

    let response = {certificate: enrollment.certificate, privateKey: enrollment.key.toBytes(), orgMSPID: organizationConfig.mspid}
    return response;
  } catch (error) {
    console.error(`Failed to register user ${userId}: ${error}`);
    return {error: error};
  }
};


const revokeUser = async function (userId) {

  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);


    const adminIdentity = await wallet.get(appAdmin);
    if (!adminIdentity) {
      return {
        error: `An identity for the admin user ${appAdmin} does not exist in the wallet. 
        Run the src/enrollAdmin.js application before retrying`
      };
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet: wallet, identity: appAdmin, discovery: gatewayDiscovery });

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    const identityService = ca.newIdentityService();
    identityService.delete(userId, adminUser);
  
    return {message: "Revoked user successfuly"};
  } catch (error) {
    console.error(`Failed to register user ${userId}: ${error}`);
    return {error: error};
  }
};

module.exports = {
  registerUser,
  revokeUser
}