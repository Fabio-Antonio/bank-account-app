# Etapa de construcción
FROM node:18 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run start:build

# Etapa para las dependencias de producción
FROM node:18 as prod-deps

WORKDIR /app

COPY package.json ./
RUN npm install --only=prod

# Etapa final de producción
FROM node:18 as prod

EXPOSE 3000
WORKDIR /app

ENV APP_VERSION=${APP_VERSION}

COPY package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start:prod"]

