#build stage
FROM node:14.15.4-alpine AS builder
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
RUN npm ci
EXPOSE 3000
CMD ["npm", "run", "rest"]
