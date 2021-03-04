FROM node:15.10.0-alpine3.10

RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app
RUN apk update && apk upgrade

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=5000

CMD ["npm", "run", "start"]
