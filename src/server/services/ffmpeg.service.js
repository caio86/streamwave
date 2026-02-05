import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import os from "os";
import AppError, { STATUS_CODE } from "../utils/appError.js";

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const readFileAsync = promisify(fs.readFile);

class FfmpegService {
  async convertToMp4(file) {
    const extension = file.originalname.split(".").pop();

    const tmpDir = os.tmpdir();

    const inputName = `/temp_input_${Date.now()}.${extension}`;
    const outputName = `/temp_output_${Date.now()}.mp4`;

    const tempInput = path.join(tmpDir, inputName);
    const tempOutput = path.join(tmpDir, outputName);

    const fileBuffer = file.buffer;

    try {
      await writeFileAsync(tempInput, fileBuffer);

      await new Promise((resolve, reject) => {
        console.log("Starting video conversion to MP4...");
        ffmpeg(tempInput)
          .output(tempOutput)
          .videoCodec("libx264")
          .audioCodec("aac")
          .size("1280x720")
          .on("end", () => {
            console.log("Video conversion completed.");
            resolve();
          })
          .on("error", (err) => {
            console.error("Error during video conversion:", err);
            reject(err);
          })
          .run();
      });

      const convertedBuffer = await readFileAsync(tempOutput);

      file.buffer = convertedBuffer;
      file.originalname = "movie.mp4";
      file.mimeType = "video/mp4";

      return file;
    } catch (error) {
      throw new AppError(
        "Error writing temporary input file: " + error.message,
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    } finally {
      if (fs.existsSync(tempInput)) await unlinkAsync(tempInput);
      if (fs.existsSync(tempOutput)) await unlinkAsync(tempOutput);
    }
  }
}

export default new FfmpegService();
