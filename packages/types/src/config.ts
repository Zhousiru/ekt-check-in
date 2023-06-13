export interface Config {
  proxy: {
    websocketPort: number;
    apiPort: number;
    token: string;
  };
  worker: {
    proxyAddress: string;
    socksProxyUrl?: string;
    idGenerator: () => string;
  };
}

export interface WebConfig {
  proxyApi: string;
}
