// Show available video of raw-video bucket

import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "../config/storage.js";
import "dotenv/config";

const rawBucket = process.env.BUCKET_RAW_VIDEO;

const list = await s3Client.send(
  new ListObjectsV2Command({
    Bucket: rawBucket,
  })
);

console.log("=================================");
console.log(list.Contents.map(e => e.Key));
console.log("=================================");
