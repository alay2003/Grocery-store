# use the official node.js image as the base image
from node:14

# set the working directory in the container
workdir /usr/src/app

# copy package.json and package-lock.json
copy package*.json ./

# install app dependencies
run npm install

# copy the rest of your application code
copy . .

# expose the port that your app runs on
expose 3000

# start the application
cmd ["npm", "start"]