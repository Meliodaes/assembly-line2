//-------------------- Init --------------------

//Global Var :
var moduleTiles, moduleId, modifType;
var map = new Array(), turnMap = new Array(), tempArray = new Array();

//DOM :
const buildMenu = document.querySelector('.overlay_build');
const yesNoBtn = document.querySelector('.ui_btn_yesno');
const noBtn = document.querySelector('.btn_no');
const creationBar = document.querySelector('.ui_creationBar');

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

loadImg('src/media/module/module.png').then(img => moduleTiles=img);


//-------------------- Manage 'creation bar' after clicking on a button --------------------

function creationBarManagement(actBtn, state){
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


//-------------------- Manage module --------------------

function drawModule(id, x, y){
    switch(id){
        case 1: ctx.drawImage(moduleTiles,0,0,32,32,x,y,32,32); break;
        case 2: ctx.drawImage(moduleTiles,32,0,32,32,x,y,32,32); break;
        case 3: ctx.drawImage(moduleTiles,64,0,32,32,x,y,32,32); break;
        case "arrow": ctx.drawImage(moduleTiles,96,0,32,32,x,y,32,32); break;
        default: return false; break;
    }
}

function rotateModule(col,line,opt){
    ctx.clearRect(col*32,line*32,32,32);
    ctx.save();
    ctx.translate((col*32)+16,(line*32)+16);
    ctx.rotate((turnMap[line][col]*90)*(Math.PI/180));
    ctx.translate(-(col*32)-16,-(line*32)-16);
    drawModule(map[line][col],col*32,line*32);
    drawModule(opt,col*32,line*32);
    ctx.restore();
}


//-------------------- Canvas management (event, etc) --------------------

//Canvas mapping :
for(var i=0;i<16;i++){
    map[i] = new Array();
    turnMap[i] = new Array();
    for(var j=0;j<16;j++){
        map[i][j] = 0;
        turnMap[i][j] = 0;
    }
}

//Click event :
canvas.addEventListener("click", (e) => {
    var rect = canvas.getBoundingClientRect();
    var col = Math.trunc((e.clientX-rect.left)/32);
    var line = Math.trunc((e.clientY-rect.top)/32);
    var index = tempArray.indexOf("map["+line+"]["+col+"]");
    
    if(modifType=="build"){
        if(map[line][col]==0 && index <= -1){
            tempArray.push("map["+line+"]["+col+"]");
            ctx.fillStyle = "#3ad33a";
            ctx.fillRect(col*32,line*32,32,32);
        }
        else if(index > -1){
            map[line][col]=0;
            tempArray.splice(index,1);
            ctx.clearRect(col*32,line*32,32,32);
        }
    }
    else if(modifType=="remove"){
        if(index <= -1 && map[line][col]!==0){
            tempArray.push("map["+line+"]["+col+"]");
            ctx.fillStyle = "#901818";
            ctx.fillRect(col*32,line*32,32,32);
        }
        else if(index > -1 && map[line][col]!==0){
            ctx.clearRect(col*32,line*32,32,32);
            drawModule(map[line][col],col*32,line*32);
            rotateModule(col,line,"");
            tempArray.splice(index,1);
        }
    }
    else if(modifType=="move"){
        if(map[line][col]!==0 && tempArray.length==0){
            tempArray.push("map["+line+"]["+col+"]");
            ctx.fillStyle = "#3ad33a";
            ctx.fillRect(col*32,line*32,32,32);
        }
        else if(map[line][col]!==0 && tempArray.length > 0 && "map["+line+"]["+col+"]"==tempArray[0]){
            ctx.clearRect(col*32,line*32,32,32);
            drawModule(map[line][col],col*32,line*32);
            rotateModule(col,line,"");
            tempArray.splice(index,1);
        }
        else if(map[line][col]==0 && tempArray.length > 0){
            var coord = (tempArray[0].match(/\d+/g).map(Number) + "").split(",");
            map[line][col] = eval(tempArray[0]);
            turnMap[line][col] = turnMap[coord[0]][coord[1]];
            ctx.clearRect(coord[1]*32,coord[0]*32,32,32);
            drawModule(map[line][col],col*32,line*32);
            rotateModule(col,line,"");
            map[coord[0]][coord[1]] = 0;
            turnMap[coord[0]][coord[1]] = 0;
            tempArray.splice(index,1);
        }
    }
    else if(modifType=="turn"){
        if(map[line][col]!==0){
            turnMap[line][col] = (turnMap[line][col]+1)%4
            rotateModule(col,line,"arrow");
        }
    }
});


//-------------------- Accept/Cancel modification --------------------

function accept(){
    for(var i=0;i<16;i++){
        for(var j=0;j<16;j++){
            if(modifType == "build" && tempArray.length > 0 && tempArray.indexOf("map["+j+"]["+i+"]") <= -1){
                for(var o=0;o<tempArray.length;o++){
                    var coord = (tempArray[o].match(/\d+/g).map(Number) + "").split(",");
                    map[coord[0]][coord[1]] = moduleId;
                    ctx.clearRect(coord[1]*32,coord[0]*32,32,32);
                    drawModule(moduleId,coord[1]*32,coord[0]*32);
                }
            }
            else if(modifType == "remove" && tempArray.length > 0 && tempArray.indexOf("map["+j+"]["+i+"]") <= -1){
                for(var o=0;o<tempArray.length;o++){
                    var coord = (tempArray[o].match(/\d+/g).map(Number) + "").split(",");
                    map[coord[0]][coord[1]] = 0;
                    turnMap[coord[0]][coord[1]] = 0;
                    ctx.clearRect(coord[1]*32,coord[0]*32,32,32);
                }
            }
            else if(modifType == "move" && tempArray.length!==0){
                var coord = (tempArray[0].match(/\d+/g).map(Number) + "").split(",");
                ctx.clearRect(coord[1]*32,coord[0]*32,32,32);
                drawModule(map[coord[0]][coord[1]],coord[1]*32,coord[0]*32);
                rotateModule(coord[1],coord[0],"");
            }
            else if(modifType == "turn"){
                for(var o=0;o<tempArray.length;o++){
                    var coord = (tempArray[o].match(/\d+/g).map(Number) + "").split(",");
                    rotateModule(coord[1],coord[0],"");
                }
            }
        }
    }
    grid(false);
    modifType = "";
    tempArray = [];
    yesNoBtn.style.display = "none";
    noBtn.style.display = "inline-block";
    creationBarManagement(modifType, false);
}

function cancel(){
    if(modifType == "build" && tempArray.length > 0){
        for(var o=0;o<tempArray.length;o++){
            var coord = (tempArray[o].match(/\d+/g).map(Number) + "").split(",");
            map[coord[0]][coord[1]]=0;
            ctx.clearRect(coord[1]*32,coord[0]*32,32,32);
        }
    }
    else if(modifType == "remove" && tempArray.length > 0){
        for(var o=0;o<tempArray.length;o++){
            var coord = (tempArray[o].match(/\d+/g).map(Number) + "").split(",");
            ctx.clearRect(coord[1]*32,coord[0]*32,32,32);
            drawModule(map[coord[0]][coord[1]],coord[1]*32,coord[0]*32);
            rotateModule(coord[1],coord[0],"");
        }
    }
    grid(false);
    modifType = "";
    tempArray = [];
    yesNoBtn.style.display = "none";
    creationBarManagement(modifType, false);
}


//-------------------- Show/hide grid --------------------

function grid(state){
    if(state==true){
        canvas.style.background = "url(src/media/canvas/grid.png)";
    }else{
        canvas.style.background = "url(src/media/canvas/background.png)";
    }
}


//-------------------- Show/hide menu --------------------

function showMenu(type, state){
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


//-------------------- Preview for modification --------------------

function modifPreview(type, id=0){
    if(type == "build" && id!==0){
        buildMenu.style.display = "none";
        moduleId = id;
    }
    else if(type == "remove"){
        creationBarManagement("remove", true);
    }
    else if(type == "move"){
        noBtn.style.display = "none";
        creationBarManagement("move", true);
    }
    else if(type == "turn"){
        noBtn.style.display = "none";
        creationBarManagement("turn", true);
        for(var i=0;i<16;i++){
            for(var j=0;j<16;j++){
                if(map[i][j]!==0){
                    tempArray.push("map["+i+"]["+j+"]");
                    drawModule("arrow",j*32,i*32);
                    rotateModule(j,i,"arrow");
                }
            }
        }
    }
    
    yesNoBtn.style.display = "block";
    modifType = type;
    grid(true);
}


//-------------------- Debug --------------------

document.addEventListener("keydown",(e)=>{
    if(e.keyCode == 96){
//        console.log(tempArray);
        console.log(map);
    }
});