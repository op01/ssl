from node:7-wheezy
RUN echo deb http://ftp.debian.org/debian jessie-backports main >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y python3 build-essential ghc openjdk-8-jdk && apt-get clean
RUN git clone https://github.com/op01/isolate.git && cd isolate && make && make install
WORKDIR /app
ENTRYPOINT bin/www
EXPOSE 3000
COPY . /app
RUN npm install