import {canvas, module} from './init.js';


//-------------------- Show/hide grid --------------------

export function grid(state){
    if(state==true){
        canvas.style.background = "url(src/media/canvas/grid.png)";
    }else{
        canvas.style.background = "url(src/media/canvas/background.png)";
    }
}


//-------------------- Show/hide menu --------------------

export function showOverlay(name,x=0,y=0){
    if(name=="build"){
        if(document.querySelector('.overlay_build').style.display=="none"){
            document.querySelector('.overlay_build').style.display = "flex";
            creationBarManagement("build", true);
        }else{
            document.querySelector('.overlay_build').style.display = "none";
            creationBarManagement("build", false);
        }
    }
    else if(name=="starter"){
        if(document.querySelector('.overlay_starter').style.display=="none"){
            document.querySelector('.overlay_starter').style.display = "grid";
            module.add("temp",x,y,module.cases[x+','+y].id,0);
        }else{
            document.querySelector('.overlay_starter').style.display = "none";
            module.delete("temp",Object.keys(module.temp)[0].split(',')[0],Object.keys(module.temp)[0].split(',')[1]);
        }
    }
    else if(name=="spawnSelector"){
        if(document.querySelector('.overlay_spawnSelector').style.display=="none"){
            document.querySelector('.overlay_spawnSelector').style.display = "grid";
        }else{
            document.querySelector('.overlay_spawnSelector').style.display = "none";
        }
    }
}


//-------------------- Manage 'creation bar' after clicking on a button --------------------

export function creationBarManagement(actBtn, state){
    for(const child of document.querySelector('.ui_creationBar').children){
        if(child!==document.querySelector(".btn_"+actBtn) && state==true){
            child.style.opacity = "0.5";
            child.disabled = true;
        }
        else if(child!==document.querySelector(".ui_btn_"+actBtn) && state==false){
            child.style.opacity = "";
            child.disabled = false;
        }
    }
}