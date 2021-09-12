const Config = require('./src/js/Config');
const Server = require('./src/js/Server');
const config = new Config();
const server = new Server(config.protocol, config.host, config.port);
server.start();