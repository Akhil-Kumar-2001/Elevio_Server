FROM node:alpine
WORKDIR /app
EXPOSE 8080
COPY ./package*.json /app/
RUN npm install
COPY . .
CMD [ "npx","nodemon"]