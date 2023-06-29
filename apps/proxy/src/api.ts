import { config } from "@ekt-check-in/config";
import cors from "cors";
import express from "express";
import {
  handleEditCheckInDate,
  handleRegisterActivity,
  handleRequestActivities,
  handleRequestMyActivities,
} from "./handlers";

const app = express();

app.use(cors());

app.get("/request-activities", handleRequestActivities);
app.get("/register-activity", handleRegisterActivity);
app.get("/request-my-activities", handleRequestMyActivities);
app.get("/edit-check-in-date", handleEditCheckInDate);

export function startApiServer() {
  app.listen(config.proxy.apiPort);
}
