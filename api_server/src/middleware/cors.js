import cors from "cors";

const cors_config = {
  origin: ["http://localhost:5173", "http://localhost:8001"],

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],

  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],

  credentials: true,

  exposedHeaders: ["Content-Type", "Set-Cookie"],
};

export const cors_rule = cors(cors_config);

export const cors_preflight = cors(cors_config);
