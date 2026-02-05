import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { BUCKET_NAME } from "../config/env.config.js";
import s3 from "../config/s3.js";

class StorageService {
  async initBucket() {
    console.log("[Storage] Initializing bucket...");
    try {
      await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
      console.log("[Storage] Bucket exists.");
    } catch (error) {
      if (
        error.name === "NotFound" ||
        error.$metadata?.httpStatusCode === 404
      ) {
        console.log("[Storage] Bucket does not exist. Creating bucket...");
        await s3.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        console.log("[Storage] Bucket created successfully.");

        const publicPolicy = {
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "PublicReadGetObject",
              Effect: "Allow",
              Principal: "*",
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
            },
          ],
        };

        console.log("[Storage] Applying public read policy...");
        await s3.send(
          new PutBucketPolicyCommand({
            Bucket: BUCKET_NAME,
            Policy: JSON.stringify(publicPolicy),
          })
        );
        console.log("[Storage] Public read policy applied.");
      } else {
        console.error("[Storage] Error checking bucket:", error);
        throw error;
      }
    }
  }

  async uploadFile(file, folder = "") {
    const extension = file.originalname.split(".").pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
    const key = folder ? `${folder}/${fileName}` : fileName;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    return key;
  }

  async deleteFile(key) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
  }
}

export default new StorageService();
