FROM node:16-alpine as build

WORKDIR /app

COPY package.json ./
RUN yarn

COPY src/ ./src/
COPY public/ ./public/
COPY tsconfig.json .

RUN yarn build --production

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
