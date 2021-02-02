export function loadImg(url){
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener("load", () => {
            resolve(img);
        });
        img.src = url;
    });
}

export function loadJSON(url){
    return fetch(url).then(r => {return r.json()});
}