from node:7-wheezy
RUN apt-get update && apt-get install -y python3 build-essential
RUN git clone https://github.com/op01/isolate.git && cd isolate && make && make install
WORKDIR /app
ENTRYPOINT bin/www
EXPOSE 3000
COPY . /app
