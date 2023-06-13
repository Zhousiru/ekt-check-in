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

export function add(a: number, b: number) {
  return a + b;
}
