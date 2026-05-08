import fs from "fs";
import path from "path";
import { pipeline } from "node:stream/promises";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/storage.js";

const contentTypeMap = {
  ".m3u8": "application/vnd.apple.mpegurl",
  ".ts": "video/MP2T",
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".json": "application/json",
  ".txt": "text/plain",
};

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return contentTypeMap[ext] || "application/octet-stream";
};

export const downloadObjectToFile = async (bucket, key, destinationPath) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3Client.send(command);
  await fs.promises.mkdir(path.dirname(destinationPath), { recursive: true });
  const body = response.Body;
  if (!body) throw new Error(`S3 object body empty for key ${key}`);
  await pipeline(body, fs.createWriteStream(destinationPath));
  return destinationPath;
};

export const uploadFileToBucket = async (bucket, key, filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileStream,
    ContentType: getContentType(filePath),
  });
  await s3Client.send(command);
  return key;
};

export const uploadDirectoryToBucket = async (
  bucket,
  prefix,
  sourceDirectory,
  rootDirectory = sourceDirectory,
) => {
  const entries = await fs.promises.readdir(sourceDirectory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(sourceDirectory, entry.name);
    if (entry.isDirectory()) {
      await uploadDirectoryToBucket(bucket, prefix, fullPath, rootDirectory);
      continue;
    }

    const relativePath = path.relative(rootDirectory, fullPath).split(path.sep).join("/");
    const objectKey = `${prefix.replace(/\/+$/g, "")}/${relativePath}`;
    await uploadFileToBucket(bucket, objectKey, fullPath);
  }
};
