FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install sharp

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
