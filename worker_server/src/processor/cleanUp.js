import fs from "fs/promises";

// Set policy to auto delete raw video in Vietnix 
// TTL = 60 * 60 * 12


// Clean raw video & .ts of tempory directory
export const cleanupTemp = async (tempDir) => {
  if (!tempDir) return;
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } 
  catch (err) {
    console.warn(`[Worker] cleanup failed for ${tempDir}:`, err.message || err);
  }
};