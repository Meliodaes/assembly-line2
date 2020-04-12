//-------------------- Init --------------------

//Global Var :
var starterImg, modifType;
var map = new Array();
var saveMap = new Array();

//DOM :
const buildMenu = document.querySelector('.overlay_build');
const yesNoBtn = document.querySelector('.ui_btn_yesno');

//Canvas :
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//Cancel selection
document.onselectstart = (e) => {e.preventDefault();}; 


//-------------------- Load image --------------------

function loadImg(url){
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener("load", () => {
            resolve(img);
        });
        img.src = url;
    });
}

loadImg('src/media/module/starter.png').then(img => starterImg=img);


//-------------------- Canvas mapping --------------------

for(var i=0;i<16;i++){
    map[i] = new Array(16);
    saveMap[i] = new Array(16);
    for(var j=0;j<16;j++){
        map[i][j] = 0;
        saveMap[i][j] = 0;
        
    }
}


//-------------------- Click event on canvas --------------------

canvas.addEventListener("click", (e) => {
    var rect = canvas.getBoundingClientRect();
    var col = Math.trunc((e.clientX-rect.left-5.5)/32);
    var line = Math.trunc((e.clientY-rect.top-5.5)/32);
    
    if(modifType=="placing"){
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
    
    else if(modifType=="removing"){
        if(map[line][col]!==0 && map[line][col]!==0.5){
            map[line][col]=0.5;
            ctx.fillStyle = "#901818";
            ctx.fillRect(col*32,line*32,32,32);
        }
        else if(map[line][col]==0.5){
            map[line][col] = saveMap[line][col];
            ctx.clearRect(col*32,line*32,32,32);
            ctx.drawImage(newCanvas,col*32,line*32,32,32,col*32,line*32,32,32);
        }
    }
});


//-------------------- Show/hide grid --------------------

function grid(state){
    if(state==true){
        canvas.style.background = "url(src/media/canvas/grid.png)";
    }else{
        canvas.style.background = "url(src/media/canvas/background.png)";
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


//-------------------- Preview for placing/remove multiple 'module' --------------------

const newCanvas = document.createElement('canvas');
const newCtx = newCanvas.getContext('2d');
newCanvas.height = 512; newCanvas.width = 512;

function multiPlacing(){
    grid(true);
    modifType = "placing";
    buildMenu.style.display = "none";
    yesNoBtn.style.display = "block";
}

function multiRemove(){
    grid(true);
    modifType = "removing";
    yesNoBtn.style.display = "block";
    newCtx.clearRect(0,0,512,512);
    newCtx.drawImage(canvas,0,0);
}


//-------------------- Accept/Undo modification --------------------

function accept(){
    for(var i=0;i<16;i++){
        for(var j=0;j<16;j++){
            if(map[i][j]==0.5){
                if(modifType == "placing"){
                    map[i][j]=1;
                    saveMap[i][j]=1;
                    ctx.clearRect(j*32,i*32,32,32);
                    ctx.drawImage(starterImg,j*32,i*32,32,32);
                }
                else if(modifType == "removing"){
                    map[i][j]=0;
                    saveMap[i][j]=0;
                    ctx.clearRect(j*32,i*32,32,32);
                }
            }
        }
    }
    grid(false);
    modifType = "";
    yesNoBtn.style.display = "none";
}

function cancel(){
    for(var i=0;i<16;i++){
        for(var j=0;j<16;j++){
            if(map[i][j]==0.5){
                if(modifType == "placing"){
                    map[i][j]=0;
                    ctx.clearRect(j*32,i*32,32,32);
                }
                else if(modifType == "removing"){
                    map[i][j] = saveMap[i][j];
                    ctx.clearRect(j*32,i*32,32,32);
                    ctx.drawImage(newCanvas,j*32,i*32,32,32,j*32,i*32,32,32);
                }
            }
        }
    }
    grid(false);
    modifType = "";
    yesNoBtn.style.display = "none";
}


//-------------------- Debug --------------------

document.addEventListener("keydown",(e)=>{
   if(e.keyCode == 96){
       console.log(map);
       console.log(saveMap);
   }
});