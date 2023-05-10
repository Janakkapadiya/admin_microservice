FROM node:alpine as local

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:assignment

FROM node:alpine as production

ARG NODE_ENV=Production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=local /usr/src/app/dist ./dist

CMD ["node", "dist/apps/assignment/main"]



# FROM node:16 

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build:assignment

# EXPOSE 3000

# CMD [ "npm","run","start:prod:assignment" ]
