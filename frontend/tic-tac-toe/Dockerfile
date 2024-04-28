FROM node:latest

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/
COPY src /app/src
COPY public /app/public
COPY config-overrides.js /app/

RUN npm install
COPY . .

# start app
CMD ["npm", "start"]