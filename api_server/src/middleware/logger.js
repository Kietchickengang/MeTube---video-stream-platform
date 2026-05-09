import morgan from "morgan";
import path from "path";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Customize timezone in VietNam
morgan.token("vn-time", () => {
  return new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
});

// Save access.log in folder "logs" + append logs
const accessLogStream = createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' });

const devFormat =  ":vn-time :method :url :status :response-time ms - :res[content-length]";

export const logger = morgan(devFormat, {
    stream: accessLogStream,
})