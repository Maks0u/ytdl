class Main {
    constructor() {
        this.searchString = document.getElementById("search").value;
        this.search();
    }
    search() {
        this.searchString = document.getElementById("search").value;
        if (!this.searchString) return;
        const body = { searchString: this.searchString }
        fetch("{{ protocol }}://{{ host }}:{{ port }}/search", {
            method: "post",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json" }
        })
            .then((response) => response.json())
            .then(data => {
                new List(data);
            });
    }
    play(yturl) {
        const body = { url: yturl };
        fetch("{{ protocol }}://{{ host }}:{{ port }}/play", {
            method: "post",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json" }
        })
            .then((response) => response.json())
            .then(data => window.open(data));
    }
    download(yturl) {
        const body = { url: yturl };
        fetch("{{ protocol }}://{{ host }}:{{ port }}/download", {
            method: "post",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json" }
        })
            .then(response => response.blob())
            .then(blob => {
                const blobURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = blobURL;
                anchor.download = 'video.mp4';
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                window.URL.revokeObjectURL(blob);
            });
    }
    audio(yturl) {
        const body = { url: yturl };
        fetch("{{ protocol }}://{{ host }}:{{ port }}/audio", {
            method: "post",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json" }
        })
            .then(response => response.json())
            .then(data => window.open(data));
    }

    audiodownload(yturl) {
        const body = { url: yturl };
        fetch("{{ protocol }}://{{ host }}:{{ port }}/audiodownload", {
            method: "post",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json" }
        })
            .then(response => response.blob())
            .then(blob => {
                const blobURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = blobURL;
                anchor.download = 'audio.ogg';
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                window.URL.revokeObjectURL(blob);
            });
    }
}

class Video {
    constructor(thumbnail, title, url) {
        this.thumbnail = thumbnail;
        this.title = title;
        this.url = url;
    }
}

class List {
    constructor(list) {
        this.tableHead = document.getElementById("tablehead");
        this.tableBody = document.getElementById("tablebody");
        this.innerHTML = "";
        this.list = list;

        this.build();
    }
    build() {
        this.list.forEach(videoElement => {
            const video = new Video(videoElement.bestThumbnail.url, videoElement.title, videoElement.url);
            const playButton = `<span onclick="main.play('${video.url}')" class="fi-rr-play">`;
            const videoDownload = `<span onclick="main.download('${video.url}')" class="fi-rr-download">`;
            const audioButton = `<span onclick="main.audio('${video.url}')" class="fi-rr-file-music"`;
            const audioDownload = `<span onclick="main.audiodownload('${video.url}')" class="fi-rr-download">`;
            this.innerHTML += `<tr><td class="col-1"><img src="${video.thumbnail}"/></td><td class="col-2">${video.title}</td><td class="col-3">${playButton}</td><td class="col-4">${videoDownload}</td><td class="col-5">${audioButton}</td><td class="col-6">${audioDownload}</td></tr>`;
        });

        this.tableHead.style.opacity = 1;
        this.tableBody.innerHTML = this.innerHTML;
    }
}

const main = new Main();