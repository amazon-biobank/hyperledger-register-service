import { Gateway, Wallets } from "fabric-network";
import path from "path";
import { FabricNetworkConnection } from "../fabric/network";
import { createAccount } from "./CreateAccount";
import { enrollUser } from "./EnrollUser";

export const registerUser = async function (userId: string) {
    try {
        const network = FabricNetworkConnection.getInstance();
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
    
        const adminIdentity = await wallet.get(network.appConfig.appAdmin);
        if (!adminIdentity) {
            throw Error(`An identity for the admin user ${network.appConfig.appAdmin} does not exist in the wallet. 
                Run the src/enrollAdmin.js application before retrying`);
        }
    
        const gateway = new Gateway();
        await gateway.connect(
            network.connectionProfile,
            {
                wallet: wallet,
                identity: network.appConfig.appAdmin,
                discovery: network.appConfig.gatewayDiscovery
            });
        const enrollment = await enrollUser(wallet, adminIdentity, userId);
        await createAccount(gateway, enrollment, userId);
    
        let response = {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
            orgMSPID: network.organizationProfile.mspid
        }
        return response;
    }
    catch (error) {
        console.error(`Failed to register user ${userId}: ${error}`);
        throw Error("Failed to register user.");
    }
  };