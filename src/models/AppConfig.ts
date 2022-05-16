import { GatewayDiscoveryOptions } from "./GatewayDiscoveryOptions";


export type AppConfig = {
    appAdmin: string;
    appAdminSecret: string;
    orgKey: string;
    caName: string;
    gatewayDiscovery: GatewayDiscoveryOptions
}
