import FabricCAServices from 'fabric-ca-client';
import fs from 'fs';
import path from 'path';
import { getConnectionProfile } from '../connection/GetConnectionProfile';
import { AppConfig } from '../models/AppConfig';
import { ConnectionProfile, OrganizationProfile } from '../models/ConnectionProfile';


export class FabricNetworkConnection {
  private static instance: FabricNetworkConnection;

  public appConfig: AppConfig;
  public connectionProfile: ConnectionProfile;
  public organizationProfile: OrganizationProfile;
  public caKey: string;
  public caURL: string;
  public ca: FabricCAServices;


  public static getInstance = (): FabricNetworkConnection => {
      if (!FabricNetworkConnection.instance){
          throw Error("Hyperledger connection  has not been initialized");
      }
      return FabricNetworkConnection.instance;
  }

  public constructor() {
    FabricNetworkConnection.instance = this;
  }

  public init = async (): Promise<void> => {
    const configPath = path.join(process.cwd(), './src/config.json');
    const configJSON = fs.readFileSync(configPath, 'utf8');
    this.appConfig = JSON.parse(configJSON);
    this.connectionProfile = await getConnectionProfile();
    this.organizationProfile = this.connectionProfile.organizations[this.appConfig.orgKey];
    this.caKey = this.organizationProfile.certificateAuthorities[0];
    this.caURL = this.connectionProfile.certificateAuthorities[this.caKey].url;
    this.ca = new FabricCAServices(this.caURL);
  }
}
