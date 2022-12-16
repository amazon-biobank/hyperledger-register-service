import FabricCAServices from "fabric-ca-client";
import { Gateway } from "fabric-network";

export async function createAccount(gateway: Gateway, enrollment: FabricCAServices.IEnrollResponse, userId: string) {
    const network = await gateway.getNetwork('mychannel');
    const contract = await network.getContract('currency', 'AccountContract');
    const createdAt = new Date();
    const accountAttributes = {
      certificate: enrollment.certificate,
      name: userId,
      created_at: createdAt.toDateString()
    };
    return contract.submitTransaction('createAccount', JSON.stringify(accountAttributes));
  }