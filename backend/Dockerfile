FROM node

LABEL author="mcuve"

WORKDIR /app

COPY .env.production .env

COPY . .



RUN npm i

EXPOSE 4000

ENV NODE_ENV=production


CMD ["npm","run","dev"]



