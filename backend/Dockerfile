FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm i
RUN npm i -D @types/multer
RUN mkdir avatars

COPY . ./
RUN npm run build

CMD ["npm", "run", "start:prod"]
