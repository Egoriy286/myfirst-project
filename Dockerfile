# base image
FROM node:20.17.0

# set working directory
WORKDIR /app
# install and cache app dependencies
COPY . .
RUN npm install

EXPOSE 5200

CMD ["npm", "run", "serve"]
