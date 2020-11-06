FROM node

LABEL author="mcuve"

WORKDIR /app

COPY .env.production .env

COPY package.json .

RUN npm i

COPY . .

EXPOSE 4000


# VOLUME [ "./.env.production:/app/.env" ]

ENV NODE_ENV=production

USER node


CMD ["npm","run","dev"]



