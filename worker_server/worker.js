import express from "express";
import "dotenv/config";

import "./src/processor/videoProcessor.js";
//import "./src/service/test.js";

const app = express();
const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`Worker server is running on port ${port}`);
});


