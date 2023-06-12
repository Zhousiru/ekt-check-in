import { config } from "@ekt-check-in/config";

export function randomAccount() {
  return config.worker.idGenerator();
}
