FROM node:latest
LABEL authors="Benja"
WORKDIR /app

COPY . .

WORKDIR /app/src

RUN npm install
RUN npx tsc

EXPOSE 3000
CMD ["npm", "start"]