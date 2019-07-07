FROM node:8.15-alpine

# Set default buildtime_variable
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Set local timezone
RUN apk add --update tzdata && \
  cp /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime && \
  echo "Asia/Ho_Chi_Minh" > /etc/timezone

# Install Yarn & Libraries
RUN set -ex; \
  apk update && apk add yarn && \
  apk add --no-cache automake git curl ca-certificates build-base wget openssl python make g++ bash coreutils grep sed
  # && apk del python make build-base g++

# Set a working directory
WORKDIR /usr/src/app

# Install Docker Compose Wait
# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
# RUN chmod +x /wait

# Install Node.js packages
COPY package.json yarn.lock install-dependencies.sh ./
RUN ./install-dependencies.sh

# Entrypoint for container
COPY entrypoint.sh ./entrypoint.sh
RUN sed -i 's/\r//' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

COPY start.sh ./start.sh
RUN sed -i 's/\r//' ./start.sh
RUN chmod +x ./start.sh

# Copy the app's code into the container
COPY . .

ENTRYPOINT [ "./entrypoint.sh" ]

# Expose port for proxy
EXPOSE 3000

CMD ["sh", "./start.sh"]
