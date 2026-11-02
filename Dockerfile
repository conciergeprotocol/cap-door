FROM node:24-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY door.js serve.js ./
ENV PORT=8088
EXPOSE 8088
CMD ["node", "serve.js"]
