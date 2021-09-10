class Config {
    constructor() {
        this.host = process.env.YTDL_HOST || 'localhost';
        this.port = process.env.YTDL_PORT || '3000';
    }
}

module.exports = Config;