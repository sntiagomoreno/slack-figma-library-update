import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import axios from "axios";
import Blocks from "./blocks";

dotenv.config();
const ngrok = require("ngrok");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

export interface LibraryItemData {
  key: string;
  name: string;
}

export interface User {
  id: string;
  handle: string;
  img_url: string;
  email: string;
}

export interface PublishedLibraryPayload {
  created_components: LibraryItemData[];
  created_styles: LibraryItemData[];
  deleted_components: LibraryItemData[];
  deleted_styles: LibraryItemData[];
  description: string;
  event_type: string;
  file_key: string;
  file_name: string;
  modified_components: LibraryItemData[];
  modified_styles: LibraryItemData[];
  passcode: "systemslulo";
  timestamp: string;
  triggered_by: User;
}

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});

app.post("/", (req: Request, res: Response) => {
  const { body } = req;
  const { passcode, file_name } = body;

  if (passcode === process.env.PASSCODE && file_name !== "System | Utilities") {
    const data = Blocks(body as PublishedLibraryPayload);
    const cleanedUpBlocks = data.blocks.filter(
      (element) => Object.keys(element).length !== 0
    );
    data.blocks = cleanedUpBlocks;
    res.status(200).json({ message: "success" });
    axios.post(process.env.SLACK_URL, data).catch((err) => console.log(err));
  }
});
