import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import { createTimestamps } from "../../../api_server/src/util/helper.js";

const db = await connectDB();
const videos = db.collection("videoCollection");

// Input sample
const sampleTest = {
  videoId: "vid_001",
  userId: new ObjectId(),
  title: "Test video",
  description: "Demo insert",
  status: "uploading",
  videoPath: "video/raw/vid_001.mp4",
  hlsPath: "hls/vid_001/index.m3u8",
  thumbnailUrl: "thumbnail/vid_001.jpg",
  duration: 120,
  resolution: "720p",
  videoSize: 5000000,
  mimeType: "video/mp4",
  unexpected_err: "",
  retryCnt: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

// Test insert data into MongoDB
export const testDB = async() => await videos.insertOne(sampleTest);

// Set up database operations
export const VideoDB_operation = {
  // CREATE
  async create(data) { return videos.insertOne(createTimestamps(data)); },

  // FIND
  async findById(id) { return videos.findOne({ _id: new ObjectId(id) }); },

  async findByVideoId(videoId) { return videos.findOne({ videoId }); },

  // UPDATE
  async updateById(id, data) {
    return videos.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: data,
        $currentDate: { updatedAt: true },
      }
    );
  },

  async updateStatus(videoId, status) {
    return videos.updateOne(
      { videoId },
      {
        $set: { status },
        $currentDate: { updatedAt: true },
      }
    );
  }

  // DELETE
};