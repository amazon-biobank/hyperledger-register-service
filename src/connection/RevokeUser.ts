import { Gateway, Wallets } from "fabric-network";
import path from "path";
import { FabricNetworkConnection } from "../fabric/network";

export const revokeUser = async function (userId) {
    try {
        const network = FabricNetworkConnection.getInstance();
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const adminIdentity = await wallet.get(network.appConfig.appAdmin);
        if (!adminIdentity) {
            return {
            error: `An identity for the admin user ${network.appConfig.appAdmin} does not exist in the wallet. 
            Run the src/enrollAdmin.js application before retrying`
            };
        }
    
        const gateway = new Gateway();
        await gateway.connect(network.connectionProfile,
            {
                wallet: wallet,
                identity: network.appConfig.appAdmin,
                discovery: network.appConfig.gatewayDiscovery
            });
    
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');
        const identityService = network.ca.newIdentityService();
        identityService.delete(userId, adminUser);
    
        return { message: "Revoked user successfuly" };
        } catch (error) {
        console.error(`Failed to register user ${userId}: ${error}`);
        return { error: error };
        }
};