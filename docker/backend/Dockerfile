FROM node:24-alpine

WORKDIR /app

RUN apk update && apk add --no-cache ffmpeg openssl

COPY package*.json ./

RUN npm ci

COPY prisma.config.js .

COPY src/server/prisma ./src/server/prisma/

RUN npm run prisma:generate

COPY . .

ENV BCRYPT_SALT=10
ENV JWT_SECRET="your_jwt_secret_key"
ENV JWT_EXPIRES_IN="1h"
ENV AWS_REGION="us-east-1"
ENV S3_ENDPOINT="http://localhost:9000"
ENV BUCKET_NAME="streamwave-bucket"
ENV DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

COPY docker/backend/docker-entrypoint.sh .

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT [ "./docker-entrypoint.sh" ]

CMD ["npm", "start"]
