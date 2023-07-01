import { config } from "@ekt-check-in/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import {
  handleEditCheckInDate,
  handleRegisterActivity,
  handleRequestActivities,
  handleRequestMyActivities,
} from "./handlers";

const app = express();

app.use(
  cors(),
  morgan(
    `Request: :date[clf] | :remote-addr | :method ":url" | :status | :response-time ms`
  )
);

app.get("/request-activities", handleRequestActivities);
app.get("/register-activity", handleRegisterActivity);
app.get("/request-my-activities", handleRequestMyActivities);
app.get("/edit-check-in-date", handleEditCheckInDate);

export function startApiServer() {
  app.listen(config.proxy.apiPort);
}
