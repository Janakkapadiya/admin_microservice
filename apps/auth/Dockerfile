FROM node:alpine as local

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN apk update && apk add bash

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

COPY . .

RUN npm run build:auth

FROM node:alpine as production

ARG NODE_ENV=Production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=local /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]



# FROM node:16 

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build:auth

# EXPOSE 3000

# CMD [ "npm","run","start:prod:auth" ]
