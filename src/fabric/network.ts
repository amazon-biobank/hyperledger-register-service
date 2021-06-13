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

exports.registerUser = async function (userId) {

  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const adminWallet = await Wallets.newFileSystemWallet(walletPath);


    const adminIdentity = await adminWallet.get(appAdmin);

    if (!adminIdentity) {
      return {
        error: `An identity for the admin user ${appAdmin} does not exist in the AdminWallet. 
        Run the src/enrollAdmin.js application before retrying`
      };
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet: adminWallet, identity: appAdmin, discovery: gatewayDiscovery });

    const provider = adminWallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    const secret = await ca.register({ affiliation: 'usp', enrollmentID: userId, role: 'client' }, adminUser);

    const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: secret });
  

    let response = {certificate: enrollment.certificate, privateKey: enrollment.key.toBytes(), orgMSPID: organizationConfig.mspid}
    return response;
  } catch (error) {
    console.error(`Failed to register user ${userId}: ${error}`);
    return {error: error};
  }
};