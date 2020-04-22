//-------------------- Init --------------------

//Require :
import {loadImg} from './loaders.js';
import {Money} from './classes.js';
import {grid, showMenu, creationBarManagement} from './ui.js';
import {init} from './init.js';

//Global Var :
var moduleTiles, moduleId, modifType;
var map = new Array(), turnMap = new Array(), tempArray = new Array();
const money = new Money(6000,0);

//DOM :
export const buildMenu = document.querySelector('.overlay_build');
export const creationBar = document.querySelector('.ui_creationBar');
const yesNoBtn = document.querySelector('.ui_btn_yesno');
const noBtn = document.querySelector('.btn_no');
const uiSpendMoney = document.querySelector('.ui_moneyspend');

//Canvas :
export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

//Load module tile
loadImg('src/media/module/module.png').then(img => moduleTiles=img);

//Launch initialisation function (buffer, etc)
init();
//document.querySelector('.loading').style.display = "none"; //BYPASS

//-------------------- Module Cost --------------------

function moduleCost(id){
    switch(id){
        case 1: return 1000;
        case 2: return 5000;
        case 3: return 300;
        case 4: return 10000;
        case 5: return 10000;
        case 6: return 10000;
        case 7: return 20000;
    }
}


//-------------------- Manage module --------------------

function drawModule(id, x, y){
    switch(id){
        case 1: ctx.drawImage(moduleTiles,0,0,32,32,x,y,32,32); break;
        case 2: ctx.drawImage(moduleTiles,32,0,32,32,x,y,32,32); break;
        case 3: ctx.drawImage(moduleTiles,64,0,32,32,x,y,32,32); break;
        case 4: ctx.drawImage(moduleTiles,96,0,32,32,x,y,32,32); break;
        case 5: ctx.drawImage(moduleTiles,0,32,32,32,x,y,32,32); break;
        case 6: ctx.drawImage(moduleTiles,32,32,32,32,x,y,32,32); break;
        case 7: ctx.drawImage(moduleTiles,64,32,32,32,x,y,32,32); break;
        case "arrow": ctx.drawImage(moduleTiles,96,32,32,32,x,y,32,32); break;
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
    if(opt=="arrow") drawModule(opt,col*32,line*32);
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
        if(map[line][col]==0 && index <= -1 && (money.tempMoney+moduleCost(moduleId)) <= money.amount){
            tempArray.push("map["+line+"]["+col+"]");
            ctx.fillStyle = "#3ad33a";
            ctx.fillRect(col*32,line*32,32,32);
            money.tempMoney += moduleCost(moduleId);
            uiSpendMoney.innerHTML = "-$"+money.tempMoney;
        }
        else if(index > -1){
            map[line][col]=0;
            tempArray.splice(index,1);
            ctx.clearRect(col*32,line*32,32,32);
            money.tempMoney -= moduleCost(moduleId);
            uiSpendMoney.innerHTML = "-$"+money.tempMoney;
        }
    }
    else if(modifType=="remove"){
        if(index <= -1 && map[line][col]!==0){
            tempArray.push("map["+line+"]["+col+"]");
            ctx.fillStyle = "#901818";
            ctx.fillRect(col*32,line*32,32,32);
            money.tempMoney += moduleCost(map[line][col]);
            uiSpendMoney.innerHTML = "+$"+money.tempMoney;
        }
        else if(index > -1 && map[line][col]!==0){
            ctx.clearRect(col*32,line*32,32,32);
            drawModule(map[line][col],col*32,line*32);
            rotateModule(col,line,"");
            tempArray.splice(index,1);
            money.tempMoney -= moduleCost(map[line][col]);
            uiSpendMoney.innerHTML = "+$"+money.tempMoney;
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


//-------------------- Preview for modification --------------------

export function modifPreview(type, id=0){
    if(type == "build" && id!==0){
        buildMenu.style.display = "none";
        uiSpendMoney.style.display = "flex";
        uiSpendMoney.innerHTML = "-$0000";
        moduleId = id;
    }
    else if(type == "remove"){
        creationBarManagement("remove", true);
        uiSpendMoney.style.display = "flex";
        uiSpendMoney.innerHTML = "+$0000";
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


//-------------------- Accept/Cancel modification --------------------

export function accept(){
    if(modifType == "build" && tempArray.length > 0){
        for(var o=0;o<tempArray.length;o++){
            var coord = (tempArray[o].match(/\d+/g).map(Number) + "").split(",");
            map[coord[0]][coord[1]] = moduleId;
            ctx.clearRect(coord[1]*32,coord[0]*32,32,32);
            drawModule(moduleId,coord[1]*32,coord[0]*32);
        }
        money.sub(money.tempMoney);
    }
    else if(modifType == "remove" && tempArray.length > 0){
        for(var o=0;o<tempArray.length;o++){
            var coord = (tempArray[o].match(/\d+/g).map(Number) + "").split(",");
            map[coord[0]][coord[1]] = 0;
            turnMap[coord[0]][coord[1]] = 0;
            ctx.clearRect(coord[1]*32,coord[0]*32,32,32);
        }
        money.add(money.tempMoney);
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
    grid(false);
    modifType = "";
    tempArray = [];
    money.tempMoney = 0;
    yesNoBtn.style.display = "none";
    uiSpendMoney.style.display = "none";
    noBtn.style.display = "inline-block";
    creationBarManagement(modifType, false);
}

export function cancel(){
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
    money.tempMoney = 0;
    yesNoBtn.style.display = "none";
    uiSpendMoney.style.display = "none";
    creationBarManagement(modifType, false);
}


//-------------------- Debug --------------------

//document.addEventListener("keydown",(e)=>{
//    if(e.keyCode == 96){
//        progBarGoTo(50);
//    }
//});





