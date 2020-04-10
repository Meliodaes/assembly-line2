//-------------------- Init --------------------

//DOM :
const buildMenu = document.querySelector('.overlay_build');
const yesNoBtn = document.querySelector('.ui_btn_yesno');

//Canvas + img :
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var starterImg, moduleType, placing=false;

//Cancel selection
document.onselectstart = (e) => {e.preventDefault();}; 


//-------------------- Load and draw image --------------------

function loadImg(url){
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener("load", () => {
            resolve(img);
        });
        img.src = url;
    });
}

loadImg('src/media/starter.png').then(img => starterImg=img);


//-------------------- Canvas mapping --------------------

var map = new Array();

for(var i=0;i<16;i++){
    map[i] = new Array(16)
    for(var j=0;j<16;j++){
        map[i][j] = 0;
    }
}


//-------------------- Click event on canvas --------------------

canvas.addEventListener("click", (e) => {
    var rect = canvas.getBoundingClientRect();
    var col = Math.trunc((e.clientX-rect.left-5.5)/32);
    var line = Math.trunc((e.clientY-rect.top-5.5)/32);
    
    if(placing==true){
        if(map[line][col]==0){
            map[line][col]=0.5;
            ctx.fillStyle = "#3ad33a";
            ctx.fillRect(col*32,line*32,32,32);
        }
        else if(map[line][col]==0.5){
            map[line][col]=0;
            ctx.clearRect(col*32,line*32,32,32);
        }
    }
});


//-------------------- Show/hide grid --------------------

function grid(state){
    if(state==true){
        canvas.style.background = "url(src/media/grid.png)";
    }else{
        canvas.style.background = "url(src/media/background.png)";
    }
}


//-------------------- Show/hide build menu --------------------

function showBuildMenu(){
    if(buildMenu.style.display == "none"){
        buildMenu.style.display = "flex";
    }else{
        buildMenu.style.display = "none";
    }
}


//-------------------- Preview for placing multiple 'module' --------------------

function multiPlacing(module){
    grid(true);
    placing = true;
    moduleType = module;
    buildMenu.style.display = "none";
    yesNoBtn.style.display = "block";
}


//-------------------- Accept/Undo placing of multiple 'module' --------------------

function placeModule(){
    for(var i=0;i<16;i++){
        for(var j=0;j<16;j++){
            if(map[i][j]==0.5){
                map[i][j]=1;
                ctx.clearRect(j*32,i*32,32,32);
                ctx.drawImage(starterImg,j*32,i*32,32,32);
            }
        }
    }
    grid(false);
    placing = false;
    yesNoBtn.style.display = "none";
}

function undoPlacing(){
    for(var i=0;i<16;i++){
        for(var j=0;j<16;j++){
            if(map[i][j]==0.5){
                map[i][j]=0;
                ctx.clearRect(j*32,i*32,32,32);
            }
        }
    }
    grid(false);
    placing = false;
    yesNoBtn.style.display = "none";
}