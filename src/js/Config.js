class Config {
    constructor() {
        this.serverprotocol = process.env.YTDL_SERVER_PROTOCOL || 'http';
        this.serverhost = process.env.YTDL_SERVER_HOST || 'localhost';
        this.serverport = process.env.YTDL_SERVER_PORT || '3000';

        this.publicprotocol = process.env.YTDL_PUBLIC_PROTOCOL || 'http';
        this.publichost = process.env.YTDL_PUBLIC_HOST || 'localhost';
        this.publicport = process.env.YTDL_PUBLIC_PORT || '3000';

        this.webpath = process.env.YTDL_WEB_PATH || '';

        this.searchlimit = process.env.YTDL_SEARCHLIMIT || '10';
    }
}

module.exports = Config;