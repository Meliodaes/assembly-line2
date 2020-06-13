import {Money, FileManager, Module, Ressources} from './classes.js';
import {canvasClick} from './main.js';
import {creationBarManagement} from './ui.js';

//Canvas + Buffer :
export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export const buffer = document.createElement('canvas');
const ctxBuffer = buffer.getContext('2d');
buffer.width = 160; buffer.height = 96;
ctx.imageSmoothingEnabled = false;


//Classes objects var :
export const files = new FileManager();
export const money = new Money(14000);
export const module = new Module();
export const ressources = new Ressources();



//EventListener :
document.onselectstart = (e) => {e.preventDefault();}; 

for(const el of document.querySelectorAll('.spawnType')){
    el.addEventListener("click", (e) => {
        module.changeSpawnType(el);
    });
}


//Tools :
export function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function progressBar(timer){
    for(var i=0;i<=timer;i+=1000){
        document.getElementById("prog").style.width = (i/timer)*100+"%";
        await sleep(1000);
    }
    document.querySelector('.loading').style.display = "none";
}

async function bypass(){
    await sleep(20); //BYPASS
    document.querySelector('.loading').style.display = "none"; //BYPASS
}


//Init function :
(async function init(){
    if(ctx){
        document.querySelector('canvas').addEventListener("click", canvasClick);
        await progressBar(2000);
        ctxBuffer.drawImage(files.moduleTiles,0,0); //Bufferise
    }else{
        alert("ERROR : Canvas Context cannot be reached, please reload the game...");
    }
})();