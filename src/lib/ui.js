import {canvas, buildMenu, creationBar} from './main.js';


//-------------------- Show/hide grid --------------------

export function grid(state){
    if(state==true){
        canvas.style.background = "url(src/media/canvas/grid.png)";
    }else{
        canvas.style.background = "url(src/media/canvas/background.png)";
    }
}


//-------------------- Show/hide menu --------------------

export function showMenu(type, state){
    if(type=="build"){
        if(state==true){
            buildMenu.style.display = "flex";
            creationBarManagement("build", true);
        }else{
            buildMenu.style.display = "none";
            creationBarManagement("build", false);
        }
    }
}


//-------------------- Manage 'creation bar' after clicking on a button --------------------

export function creationBarManagement(actBtn, state){
    for(var i=0;i<creationBar.children.length;i++){
        var child = creationBar.children[i];
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