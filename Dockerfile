FROM node:alpine

# Install ffmpeg (includes ffprobe)
RUN apk update && apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=2048"

# RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]