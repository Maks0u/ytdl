const express = require('express');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

class Server {

    constructor(port) {
        this.port = port;

        this.app = express();

        this.app.use(express.json());

        this.corsOptions = {
            origin: "*"
        };
        this.app.use(cors(this.corsOptions));

        this.app.get('/', this.home.bind(this));
        this.app.get('/style.css', this.style.bind(this));
        this.app.get('/icons.css', this.icons.bind(this));

        this.app.post('/search', this.search.bind(this));
        this.app.post('/url', this.getVideoURL.bind(this));
    }

    start = () => {
        http.createServer(this.app).listen(this.port);
        console.log(`Server running on port ${this.port}`)
    }

    home = (req, res) => {
        // res.sendFile('views/index.html', { root: path.join(__dirname, '../../') });

        const indexFile = fs.readFileSync(path.join(__dirname, '../../views', 'index.html'), { encoding: 'utf-8' });
        const tableFile = fs.readFileSync(path.join(__dirname, '../../views', 'table.html'), { encoding: 'utf-8' });
        const result = indexFile.replace('{{ table }}', tableFile);

        res.setHeader('Content-Type', 'text/html');
        res.status(200);
        res.send(result);
        res.end();
    }

    style = (req, res) => {
        res.sendFile('views/style.css', { root: path.join(__dirname, '../../') });
    }

    icons = (req, res) => {
        res.sendFile('uicons-regular-rounded/css/uicons-regular-rounded.css', { root: path.join(__dirname, '../../') });
    }

    search = async (req, res) => {
        const searchString = req.body.searchString;
        if (!searchString) {
            res.end();
            return;
        };
        const videoList = await utils.search(searchString);
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.json(videoList);
        res.end();
    }

    getVideoURL = async (req, res) => {
        const url = req.body.url;
        const result = (await utils.getMedia(url)).url;
        res.setHeader('Content-Type', 'text/plain');
        res.status(200);
        res.json(result);
        res.end();
    }
}

module.exports = Server;