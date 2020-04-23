//Import :
import {ctx} from './main.js';
import {grid} from './ui.js';
import {loadImg} from './loaders.js';

//DOM :
export const buffer = document.createElement('canvas');
const ctxBuffer = buffer.getContext('2d');
buffer.width = 128; buffer.height = 64;

//Var :
export var moduleTiles;

//Functions :

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bufferise(){
    await loadImg('src/media/module/module.png').then(img => moduleTiles=img);
    ctxBuffer.drawImage(moduleTiles,0,0);
}

async function progBarGoTo(percent){
    let last = parseInt(document.getElementById("prog").style.width);
    for(let i=last;i<=percent;i++){
        await sleep(1000/60);
        document.getElementById("prog").style.width = i+"%";
    }
}

export async function init(){
    if(ctx){
        grid(true);
        await progBarGoTo(10);
        grid(false);
        await bufferise();
        await progBarGoTo(50);
        await sleep(3000);
        await progBarGoTo(100);
        document.querySelector('.loading').style.display = "none";
    }else{
        alert("ERROR : Canvas Context cannot be reached, please reload the game !");
    }
    
}