import {ctx} from './main.js';
import {grid} from './ui.js';

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function progBarGoTo(percent){
    for(let i=1;i<=percent;i++){
        await sleep(1000/60);
        document.getElementById("prog").style.width = i+"%";
    }
}

export async function init(){
    if(ctx){
        grid(true);
        await progBarGoTo(10);
        grid(false);
        await sleep(3000);
        await progBarGoTo(100);
        document.querySelector('.loading').style.display = "none";
    }else{
        alert("ERROR : Canvas Context cannot be reached, please reload the game !");
    }
    
}