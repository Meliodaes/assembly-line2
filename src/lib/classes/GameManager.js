import {loadImg, loadJSON} from '../utils/loaders.js';
import {sleep, screenAnimation} from '../utils/utils.js';

export default class GameManager {
    async initGame() {
        this.loadFiles().then(async () => {
            await sleep(1000);
            document.querySelector(".l-screenFade").style.display = "block";
            screenAnimation(".l-screenFade", "screenFadeIn");
            document.querySelector(".l-loadingScreen").style.display = "none";
            document.querySelector(".l-overlay").style.display = "flex";
        });
    }

    async loadFiles() {
        return loadJSON("src/data/structures.json").then(json => {this.structuresData = json;});
    }
}