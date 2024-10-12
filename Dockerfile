# base image
FROM node:20.17.0-alpine3.20

# set working directory
WORKDIR /app
# install and cache app dependencies
COPY . .
RUN npm install

EXPOSE 5200
# start app
CMD ["npm", "run", "serve"]
# coomit