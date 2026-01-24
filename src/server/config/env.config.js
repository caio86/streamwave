import 'dotenv/config'

export const {
    PORT = 3000,
    DATABASE_URL,
} = process.env

export const isProd = DATABASE_URL === "production"