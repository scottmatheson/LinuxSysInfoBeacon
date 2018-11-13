FROM node:10-alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install -g -s --no-progress yarn && \
    yarn && \
    yarn cache clean
COPY . .
CMD [ "yarn", "start" ]