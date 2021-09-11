const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

async function getMedia(url) {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    return format;
}

async function downloadMedia(url) {
    const info = await ytdl.getInfo(url);
    const filename = `${info.videoDetails.videoId}.mp4`
    const filepath = path.join(`./media`, filename);
    ytdl(url).pipe(fs.createWriteStream(`./media/${filename}`));
    return filepath;
}

module.exports = {
    getMedia,
    downloadMedia
}