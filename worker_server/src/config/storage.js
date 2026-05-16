import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

const vietnix_endpoint = process.env.ENDPOINT;
const vietnix_access_key_id = process.env.ACCESS_KEY_ID;
const vietnix_access_key = process.env.SECRET_KEY;

export const s3Client = new S3Client({
  region: "vn-hcm",
  endpoint: vietnix_endpoint,
  credentials: {
    accessKeyId: vietnix_access_key_id,
    secretAccessKey: vietnix_access_key,
  },
  forcePathStyle: false,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});
