import { S3Client } from "@aws-sdk/client-s3";
import {
  AWS_REGION,
  MINIO_ROOT_PASSWORD,
  MINIO_ROOT_USER,
  S3_ENDPOINT,
} from "./env.config.js";

const s3Client = new S3Client({
  region: AWS_REGION,
  endpoint: S3_ENDPOINT,
  forcePathStyle: true, // Required for MinIO
  credentials: {
    accessKeyId: MINIO_ROOT_USER,
    secretAccessKey: MINIO_ROOT_PASSWORD,
  },
});

export default s3Client;
