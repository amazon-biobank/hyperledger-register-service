import { FabricNetworkConnection } from "../fabric/network";

export const enrollUser = async (wallet: any, adminIdentity: any, userId: any) => {
    const network = FabricNetworkConnection.getInstance();
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    const user = { affiliation: 'org1', enrollmentID: userId, role: 'client' };
    const secret = await network.ca.register(user, adminUser);
    const enrollRequest = { enrollmentID: userId, enrollmentSecret: secret };
    const enrollment = await network.ca.enroll(enrollRequest);
    return enrollment;
}