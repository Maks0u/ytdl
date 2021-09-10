const express = require('express');
const cors = require('cors');
const http = require('http');

class Server {

    constructor(port) {
        this.app = express();
        this.corsOptions = {
            origin: "*"
        };
        this.app.use(cors(this.corsOptions));
        this.port = port;

        this.app.get('/', this.getRoot.bind(this));
    };

    start = () => {
        http.createServer(this.app).listen(this.port);
        console.log(`Server running on port ${this.port}`)
    };

    getRoot = (req, res) => {
        res.setHeader('Content-Type', 'text/plain');
        res.status(200);
        res.send('Hello world!');
        res.end();
    }
}

module.exports = Server;