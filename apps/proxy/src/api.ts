import { config } from "@ekt-check-in/config";
import cors from "cors";
import express from "express";
import { handleRegisterActivity, handleRequestActivities } from "./handlers";

const app = express();

app.use(cors());

app.get("/request-activities", handleRequestActivities);
app.get("/register-activity", handleRegisterActivity);

export function startApiServer() {
  app.listen(config.proxy.apiPort);
}
