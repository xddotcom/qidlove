FROM node:6-stretch

RUN mkdir -p /app
WORKDIR /app
COPY . /app/

# RUN npm config set registry https://registry.npm.taobao.org/
# RUN npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/

RUN apt-get update
RUN apt-get install -y ruby-full --no-install-recommends
RUN rm -rf /var/lib/apt/lists/*

RUN gem install sass
RUN npm install -g grunt-cli@0.1.13

RUN npm install

RUN grunt dist
