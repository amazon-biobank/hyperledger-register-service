async function createAccount(gateway: any, enrollment: any, userId: any) {
    const network = await gateway.getNetwork('channel2');
    const contract = await network.getContract('currency', 'AccountContract');
    const createdAt = new Date();
    const accountAttributes = {
      certificate: enrollment.certificate,
      name: userId,
      created_at: createdAt.toDateString()
    };
    return contract.submitTransaction('createAccount', [JSON.stringify(accountAttributes)]);
  }