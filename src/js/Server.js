const express = require('express');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

class Server {

    constructor(port) {
        this.app = express();
        this.app.use(express.json());
        this.corsOptions = {
            origin: "*"
        };
        this.app.use(cors(this.corsOptions));
        this.port = port;

        this.app.get('/', this.home.bind(this));
        this.app.post('/format', this.getVideoFormat.bind(this));
        this.app.post('/url', this.getVideoURL.bind(this));
        this.app.post('/', this.getVideo.bind(this));
        this.app.get('/video', this.video.bind(this));
    };

    start = () => {
        http.createServer(this.app).listen(this.port);
        console.log(`Server running on port ${this.port}`)
    };

    home = (req, res) => {
        res.sendFile('views/index.html', { root: path.join(__dirname, '../../') });
    };

    getVideoFormat = async (req, res) => {
        console.log('getVideo');
        const url = req.body.url;
        const result = await utils.getMedia(url);
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.json(result);
        res.end();
    };

    getVideoURL = async (req, res) => {
        console.log('getVideoURL');
        const url = req.body.url;
        const result = (await utils.getMedia(url)).url;
        res.setHeader('Content-Type', 'text/plain');
        res.status(200);
        res.json(result);
        res.end();
    };

    getVideo = async (req, res) => {
        console.log('getVideo');
        const url = req.body.url;
        const filepath = await utils.downloadMedia(url);
        const video = fs.createReadStream(path.join(process.cwd(), filepath));
        setTimeout(() => {
            res.setHeader('Content-Type', 'video/mp4');
            video.pipe(res);
        }, 1000);
    };

    video = (req, res) => {

        // Ensure there is a range given for the video
        const range = req.headers.range;
        if (!range) {
            res.status(400).send("Requires Range header");
        }

        const videoPath = path.join(__dirname, '../../media', '8rRL7R3f-Jk.mp4');
        const videoSize = fs.statSync(videoPath).size;

        // Parse Range
        // Example: "bytes=32324-"
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        // Create headers
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/webm",
        };

        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);

        // create video read stream for this particular chunk
        const videoStream = fs.createReadStream(videoPath, { start, end });

        // Stream the video chunk to the client
        videoStream.pipe(res);
    }
}

module.exports = Server;