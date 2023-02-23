FROM node:14
WORKDIR /app
COPY tsconfig.json ./
COPY tslint.json ./
COPY package.json ./
RUN npm install
COPY ./src ./src
CMD ["npm", "run", "start"]

