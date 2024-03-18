FROM node:20-alpine3.18

WORKDIR /app
RUN mkdir -p /node_modules && chown node:node -R /node_modules /app
RUN npm install -g cross-env

USER node

COPY --chown=node:node package.json ./

RUN npm install

COPY --chown=node:node . ./
RUN npx prisma migrate dev --name init
RUN npx prisma generate

EXPOSE 3000
CMD [ "npm", "start" ]