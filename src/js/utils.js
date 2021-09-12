const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const Config = require('./Config');
const config = new Config();

async function search(searchString) {
    const ytsrOptions = {
        limit: config.searchlimit
    };
    const results = await ytsr(searchString, ytsrOptions);
    const videoList = results.items.filter(result => result.type === 'video');
    return videoList;
}

async function getFormat(url, quality = 'highest') {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: quality });
    return format;
}

function ytdlReadable(url) {
    return ytdl(url);
}

function ytdlReadableAudio(url) {
    return ytdl(url, { filter: format => format.codecs === 'opus' });
}

module.exports = {
    search,
    getFormat,
    ytdlReadable,
    ytdlReadableAudio
}