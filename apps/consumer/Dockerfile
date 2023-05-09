# FROM node:alpine as development

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build consumer

# FROM node:alpine as local
# ARG NODE_ENV=local
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=local

# COPY . .

# COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/apps/consumer/main"]



FROM node:14 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:14

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 7000

CMD [ "npm", "start" ]
