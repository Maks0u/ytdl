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
                console.log(data);
            });
    }
    open(yturl) {
        const body = { url: yturl }
        fetch("{{ protocol }}://{{ host }}:{{ port }}/url", {
            method: "post",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json" }
        })
            .then((response) => response.json())
            .then(data => window.open(data));
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
        this.element = document.getElementById("tablebody");
        this.innerHTML = "";
        this.list = list;

        this.build();
    }
    build() {
        this.list.forEach(element => {
            const video = new Video(element.bestThumbnail.url, element.title, element.url);
            this.innerHTML += `<tr><td><img src="${video.thumbnail}"/></td><td>${video.title}</td><td></td><td><svg onclick="main.open('${video.url}')" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="60" height="60"><path d="M20.494,7.968l-9.54-7A5,5,0,0,0,3,5V19a5,5,0,0,0,7.957,4.031l9.54-7a5,5,0,0,0,0-8.064Zm-1.184,6.45-9.54,7A3,3,0,0,1,5,19V5A2.948,2.948,0,0,1,6.641,2.328,3.018,3.018,0,0,1,8.006,2a2.97,2.97,0,0,1,1.764.589l9.54,7a3,3,0,0,1,0,4.836Z"/></svg></td></tr>`
        });
        this.element.innerHTML = this.innerHTML;
    }
}

const main = new Main();