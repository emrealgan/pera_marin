FROM node:18-bookworm

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "start"]

EXPOSE 3000
