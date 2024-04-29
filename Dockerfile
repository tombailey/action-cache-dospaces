# test
FROM docker.io/node:20.12-bookworm AS test

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY src src
RUN npm run bundle

COPY test.sh test.sh
RUN chmod +x test.sh

CMD /app/test.sh
