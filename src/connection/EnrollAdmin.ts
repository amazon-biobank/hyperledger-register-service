import { Wallets } from "fabric-network";
import path from "path";
import { FabricNetworkConnection } from "../fabric/network";

export async function enrollAdmin() {
    try {
        const network = FabricNetworkConnection.getInstance();
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get(network.appConfig.appAdmin);
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await network.ca.enroll(
            { 
                enrollmentID: network.appConfig.appAdmin,
                enrollmentSecret: network.appConfig.appAdminSecret
            });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: network.organizationProfile.mspid,
            type: 'X.509',
        };
        await wallet.put(network.appConfig.appAdmin, x509Identity);
        
        const identityCheck = await wallet.get(network.appConfig.appAdmin);
        if (identityCheck) {
            console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
            return;
        }
        throw Error(`Couldn't generate admin identity in wallet`);

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error.message}`);
    }
}
