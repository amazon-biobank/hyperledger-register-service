import axios from "axios";
import { HYPERLEDGER_CONNECTION_PROFILE, HYPERLEDGER_DNS } from "../config";
import { ConnectionProfile } from "../models/ConnectionProfile";

const connectionProfileAdapter = (rawProfile): ConnectionProfile => {
    const peerName = Object.keys(rawProfile.peers)[0];
    rawProfile.peers[peerName].url = rawProfile.peers[peerName].url.replace("localhost", HYPERLEDGER_DNS)
    const caName = Object.keys(rawProfile.certificateAuthorities)[0];
    rawProfile.certificateAuthorities[caName].url = rawProfile.certificateAuthorities[caName].url.replace("localhost", HYPERLEDGER_DNS)
    return rawProfile;
  }

export const getConnectionProfile = async (): Promise<ConnectionProfile> => {
    const connectionProfileReq = await (axios.get(HYPERLEDGER_CONNECTION_PROFILE));
    const connectionProfileJson = connectionProfileAdapter(connectionProfileReq.data);
    return connectionProfileJson;
}