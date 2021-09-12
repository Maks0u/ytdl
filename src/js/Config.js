class Config {
    constructor() {
        this.serverprotocol = process.env.YTDL_SERVER_PROTOCOL || 'http';
        this.serverhost = process.env.YTDL_SERVER_HOST || 'localhost';
        this.serverport = process.env.YTDL_SERVER_PORT || '3000';

        this.mainprotocol = process.env.YTDL_MAIN_PROTOCOL || 'http';
        this.mainhost = process.env.YTDL_MAIN_HOST || 'localhost';
        this.mainport = process.env.YTDL_MAIN_PORT || '3000';

        this.searchlimit = process.env.YTDL_SEARCHLIMIT || '10';
    }
}

module.exports = Config;