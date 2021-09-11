const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const fs = require('fs');
const path = require('path');

async function getMedia(url) {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    return format;
}

async function search(searchString) {
    const ytsrOptions = {
        limit: 10
    };
    const results = await ytsr(searchString, ytsrOptions);
    const videoList = results.items.filter(result => result.type === 'video');
    return videoList;
}

module.exports = {
    getMedia,
    search
}