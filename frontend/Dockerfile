FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY docker-entrypoint.sh /usr/local/bin/frontend-entrypoint.sh
RUN chmod +x /usr/local/bin/frontend-entrypoint.sh

COPY . .

EXPOSE 3456

ENTRYPOINT ["frontend-entrypoint.sh"]

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3456", "--force"]