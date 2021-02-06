import {loadImg, loadJSON} from '../utils/loaders.js';
import {sleep, screenAnimation} from '../utils/utils.js';
import GameRsrc from './GameRsrc.js';

export default class GameManager {
    constructor(){
        this.gameRsrc = new GameRsrc(5000, 10);
        this.gameRsrc.updateDashboard();
    }

    async initGame() {
        this.loadFiles().then(async () => {
            await sleep(1000);
            screenAnimation(".l-screenFade", "screenFadeIn");
            document.querySelector(".l-loadingScreen").style.display = "none";
            document.querySelector(".l-overlay").style.display = "flex";
        });
    }

    async loadFiles() {
        return loadJSON("src/data/structures.json").then(json => {this.structuresData = json;});
    }
}