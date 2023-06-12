import { config } from "@ekt-check-in/config";
import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";

let proxyAgent: null | SocksProxyAgent = null;

if (config.worker.socksProxyUrl) {
  proxyAgent = new SocksProxyAgent(config.worker.socksProxyUrl);
}

const client = axios.create(
  proxyAgent
    ? {
        httpAgent: proxyAgent,
        httpsAgent: proxyAgent,
      }
    : undefined
);

export default client;
