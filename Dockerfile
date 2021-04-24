FROM node:12.22.1-alpine3.10

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install && npm cache clean --force --loglevel=error

COPY --chown=node:node src ./src/
COPY --chown=node:node prisma ./prisma/
COPY --chown=node:node tsconfig.json ./tsconfig.json

RUN npm run build

CMD ["npm", "run", "start-prod"]