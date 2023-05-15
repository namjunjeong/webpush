FROM node:18.16.0
LABEL maintainer="playjnj@khu.ac.kr"

WORKDIR /usr/src/frontend

COPY package.json ./

RUN npm install

COPY . .

CMD [ "node", "app.js"]