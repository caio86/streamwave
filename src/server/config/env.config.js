import "dotenv/config";

export const {
  PORT = 3000,
  DATABASE_URL,
  BCRYPT_SALT,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  AWS_REGION,
  S3_ENDPOINT,
  MINIO_ROOT_USER,
  MINIO_ROOT_PASSWORD,
  BUCKET_NAME,
} = process.env;

export const isProd = DATABASE_URL === "production";
