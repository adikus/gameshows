FROM node:18-bullseye-slim AS base

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY package-lock.json ./

RUN npm install --omit=dev


FROM base AS build

COPY frontend frontend
COPY backend backend
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY .babelrc ./
COPY jsconfig.json ./

RUN npm install --include=dev
RUN npm run frontend:build
RUN npm run backend:build


FROM base AS final

COPY index.js ./
COPY public public
COPY views views
COPY --from=build /app/dist dist
COPY --from=build /app/build build

CMD npm run backend:production
