const express = require('express');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

class Server {

    constructor(config) {
        this.config = config;

        this.app = express();

        this.app.use(express.json());

        this.corsOptions = {
            origin: "*"
        };
        this.app.use(cors(this.corsOptions));

        this.app.get('/', this.home.bind(this));
        this.app.get('/script.js', this.script.bind(this));
        this.app.get('/style.css', this.style.bind(this));
        this.app.get('/icons.css', this.icons.bind(this));
        this.app.get('/webfonts/:filename', this.webfonts.bind(this));

        this.app.post('/search', this.search.bind(this));
        this.app.post('/play', this.getVideoURL.bind(this));
        this.app.post('/download', this.getVideoBinary.bind(this));
        this.app.post('/audio', this.getAudioURL.bind(this));
        this.app.post('/audiodownload', this.getAudioBinary.bind(this));
    }

    start = () => {
        const port = this.config.serverport;
        http.createServer(this.app).listen(port);
        console.log(`Server running on port ${port}`)
    }

    home = (req, res) => {
        const indexFile = fs.readFileSync(path.join(__dirname, '../../views', 'index.html'), { encoding: 'utf-8' });
        res.setHeader('Content-Type', 'text/html');
        res.status(200);
        res.send(indexFile);
        res.end();
    }

    style = (req, res) => {
        res.sendFile('views/style.css', { root: path.join(__dirname, '../../') });
    }

    script = (req, res) => {
        const scriptFile = fs.readFileSync(path.join(__dirname, '../../views', 'script.js'), { encoding: 'utf-8' });
        const baseUrl = `${this.config.publicprotocol}://${this.config.publichost}:${this.config.publicport}${this.config.webpath}`;
        const result = scriptFile.replace(/{{ baseurl }}/g, baseUrl);
        res.setHeader('Content-Type', 'application/javascript');
        res.status(200);
        res.send(result);
        res.end();
    }

    icons = (req, res) => {
        res.sendFile('uicons-regular-rounded/css/uicons-regular-rounded.css', { root: path.join(__dirname, '../../') });
    }

    webfonts = (req, res) => {
        res.sendFile(`uicons-regular-rounded/webfonts/${req.params.filename}`, { root: path.join(__dirname, '../../') });
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
        const result = (await utils.getFormat(url)).url;
        res.setHeader('Content-Type', 'text/plain');
        res.status(200);
        res.json(result);
        res.end();
    }

    getVideoBinary = (req, res) => {
        const url = req.body.url;
        const ytdlReadableStream = utils.ytdlReadable(url);
        res.setHeader('Content-Type', 'video/mp4');
        ytdlReadableStream.pipe(res);
        res.status(200);
    }

    getAudioURL = async (req, res) => {
        const url = req.body.url;
        const result = (await utils.getFormat(url, 'highestaudio')).url;
        res.setHeader('Content-Type', 'text/plain');
        res.status(200);
        res.json(result);
        res.end();
    }

    getAudioBinary = (req, res) => {
        const url = req.body.url;
        const ytdlReadableStream = utils.ytdlReadableAudio(url);
        res.setHeader('Content-Type', 'audio/webm');
        ytdlReadableStream.pipe(res);
        res.status(200);
    }
}

module.exports = Server;