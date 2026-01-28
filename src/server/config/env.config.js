import "dotenv/config";

export const { PORT = 3000, DATABASE_URL, BCRYPT_SALT } = process.env;

export const isProd = DATABASE_URL === "production";
