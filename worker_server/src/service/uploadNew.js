import fs from "fs";
import path from "path";
import pLimit from "p-limit";

import { uploadFileToBucket } from "./storage.js";

const fsPromises = fs.promises;
const limit = pLimit(10);

const collectFiles = async(dir) => {
  const entries = await fsPromises.readdir(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectFiles(fullPath);
      files.push(...nested);
    } 
    else {
      files.push(fullPath);
    }
  }
  return files;
};

export const uploadDirToBucket = async( bucket, prefix, sourceDirectory ) => {
  const files = await collectFiles(sourceDirectory);
  await Promise.all(
    files.map(file => limit(async() => {
        const relativePath = path.relative(sourceDirectory, file)
          .split(path.sep)
          .join("/");

        const objectKey = `${prefix}/${relativePath}`;
        await uploadFileToBucket( bucket, objectKey, file );
      })
    ));
};

