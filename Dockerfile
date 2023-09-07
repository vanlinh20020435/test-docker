FROM node

WORKDIR /app
COPY ./ ./
RUN npm install
RUN npm install nodemon --save-dev
EXPOSE 10000
WORKDIR /app/backend
CMD ["node", "index.js"]