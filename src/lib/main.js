import {grid, showOverlay, creationBarManagement} from './ui.js';
import {buffer, ctx, canvas, files, money, module, sleep, ressources} from './init.js';

//Instanciate 'onclick' function
document.querySelectorAll('button').forEach((el) => {
    if(el.hasAttribute("onclick")){
        var fn = el.getAttribute("onclick").substring(0,el.getAttribute("onclick").indexOf("("));
        window[fn] = eval(fn);
    }
});


//-------------------- Canvas management (event, etc) --------------------

export function canvasClick(e){
    var rect = canvas.getBoundingClientRect();
    var x = Math.trunc((e.clientX-rect.left)/32);
    var y = Math.trunc((e.clientY-rect.top)/32);
    
    if(module.modifType=="idle" && module.exist("cases",x,y)){
        if(module.cases[x+','+y].id==1){
            showOverlay('starter',x,y);
            document.querySelector('.costPerCycle').innerHTML = "$"+module.cases[x+','+y].costPerCycle;
            document.querySelector('.delay').innerHTML = module.cases[x+','+y].delay+"s";
            document.querySelector('.overlay_starter').children[3].querySelector('img').src = "src/media/ressources/"+module.cases[x+','+y].spawnObject+".png";
        }
    }
    else if(module.modifType=="build"){
        if(!module.exist("cases",x,y) && !module.exist("temp",x,y) && money.tempMoney+module.getPrice(module.tempId) <= money.amount){
            module.add("temp",x,y,module.tempId,0);
            ctx.fillStyle = "#3ad33a";
            ctx.fillRect(x*32,y*32,32,32);
            money.tempMoney += module.getPrice(module.tempId);
            document.querySelector('.ui_moneyspend').innerHTML = "-$"+money.tempMoney;
        }
        else if(!module.exist("cases",x,y) && module.exist("temp",x,y)){
            module.delete("temp",x,y);
            ctx.clearRect(x*32,y*32,32,32);
            money.tempMoney -= module.getPrice(module.tempId);
            document.querySelector('.ui_moneyspend').innerHTML = "-$"+money.tempMoney;
        }
    }
    else if(module.modifType=="remove"){
        if(module.exist("cases",x,y) && !module.exist("temp",x,y)){
            module.add("temp",x,y,module.cases[x+","+y].id,0,0,0);
            ctx.fillStyle = "#901818";
            ctx.fillRect(x*32,y*32,32,32);
            money.tempMoney += module.getPrice(module.cases[x+','+y].id)*90/100;
            document.querySelector('.ui_moneyspend').innerHTML = "+$"+money.tempMoney;
        }
        else if(module.exist("cases",x,y) && module.exist("temp",x,y)){
            ctx.clearRect(x*32,y*32,32,32);
            module.draw(module.cases[x+','+y].id,x,y);
            module.rotate(x,y)
            module.delete("temp",x,y);
            money.tempMoney -= module.getPrice(module.cases[x+','+y].id)*90/100;
            document.querySelector('.ui_moneyspend').innerHTML = "+$"+money.tempMoney;
        }
    }
    else if(module.modifType=="move"){
        if(module.exist("cases",x,y) && module.isEmpty("temp")){
            module.add("temp",x,y,module.cases[x+','+y].id,module.cases[x+','+y].rotation);
            ctx.fillStyle = "#3ad33a";
            ctx.fillRect(x*32,y*32,32,32);
        }
        else if(module.exist("cases",x,y) && module.exist("temp",x,y)){
            ctx.clearRect(x*32,y*32,32,32);
            module.rotate(x,y);
            module.delete("temp",x,y);
        }
        else if(!module.exist("cases",x,y) && !module.isEmpty("temp")){
            var coord = Object.keys(module.temp)[0].split(',');
            var value = module.temp[Object.keys(module.temp)[0]];
            ctx.clearRect(coord[0]*32,coord[1]*32,32,32);
            module.delete("cases",coord[0],coord[1]);
            module.add("cases",x,y,value.id,value.rotation);
            module.rotate(x,y);
            module.delete("temp",coord[0],coord[1]);
        }
    }
    else if(module.modifType=="turn"){
        if(module.exist("cases",x,y)){
            module.cases[x+','+y].rotation = (module.cases[x+','+y].rotation+1)%4;
            module.rotate(x,y,0);
        }
    }
}


//-------------------- Preview for modification --------------------

function modifPreview(type, id){
    if(type == "build"){
        document.querySelector('.overlay_build').style.display = "none";
        document.querySelector('.ui_moneyspend').style.display = "flex";
        document.querySelector('.ui_moneyspend').innerHTML = "-$0000";
        module.tempId = id;
    }
    else if(type == "remove"){
        creationBarManagement("remove", true);
        document.querySelector('.ui_moneyspend').style.display = "flex";
        document.querySelector('.ui_moneyspend').innerHTML = "+$0000";
    }
    else if(type == "move"){
        document.querySelector('.btn_no').style.display = "none";
        creationBarManagement("move", true);
    }
    else if(type == "turn"){
        document.querySelector('.btn_no').style.display = "none";
        creationBarManagement("turn", true);
        for(const el in module.cases){
            module.rotate(el.split(',')[0],el.split(',')[1],0);
        }
    }
    
    document.querySelector('.ui_btn_yesno').style.display = "block";
    module.modifType = type;
    grid(true);
}


//-------------------- Accept/Cancel modification --------------------

function accept(){
    if(module.modifType == "build" && !module.isEmpty("temp")){
        for(const el in module.temp){
            ctx.clearRect(el.split(',')[0]*32,el.split(',')[1]*32,32,32);
            module.draw(module.temp[el].id,el.split(',')[0],el.split(',')[1]);
            module.add("cases",el.split(',')[0],el.split(',')[1],module.temp[el].id, module.temp[el].rotation);
            module.delete("temp",el.split(',')[0],el.split(',')[1]);
        }
        money.change(-money.tempMoney);
    }
    
    else if(module.modifType == "remove" && !module.isEmpty("temp")){
        for(const el in module.temp){
            ctx.clearRect(el.split(',')[0]*32,el.split(',')[1]*32,32,32);
            clearInterval(module.cases[el].cycle);
            module.delete("cases",el.split(',')[0],el.split(',')[1]);
            module.delete("temp",el.split(',')[0],el.split(',')[1]);
        }
        money.change(money.tempMoney);
    }
    
    else if(module.modifType == "move" && !module.isEmpty("temp")){
        var coord = Object.keys(module.temp)[0].split(',');
        ctx.clearRect(coord[0]*32,coord[1]*32,32,32);
        module.rotate(coord[0],coord[1]);
        module.delete("temp",coord[0],coord[1])
    }
    
    else if(module.modifType == "turn"){
        for(const el in module.cases){
            ctx.clearRect(el.split(',')[0]*32,el.split(',')[1]*32,32,32)
            module.rotate(el.split(',')[0],el.split(',')[1]);
        }
    }
    
    grid(false);
    creationBarManagement(module.modifType, false);
    module.modifType = "idle";
    module.tempId = 0;
    money.tempMoney = 0;
    document.querySelector('.ui_btn_yesno').style.display = "none";
    document.querySelector('.ui_moneyspend').style.display = "none";
    document.querySelector('.btn_no').style.display = "inline-block";
}

    
function cancel(){
    if(module.modifType == "build" && !module.isEmpty("temp")){
        for(const el in module.temp){
            ctx.clearRect(el.split(',')[0]*32,el.split(',')[1]*32,32,32);
            module.delete("temp",el.split(',')[0],el.split(',')[1]);
        }
    }
    
    else if(module.modifType == "remove" && !module.isEmpty("temp")){
        for(const el in module.temp){
            ctx.clearRect(el.split(',')[0]*32,el.split(',')[1]*32,32,32);
            module.rotate(el.split(',')[0],el.split(',')[1]);
            module.delete("temp",el.split(',')[0],el.split(',')[1]);
        }
    }
    
    grid(false);
    creationBarManagement(module.modifType, false);
    module.modifType = "idle";
    module.tempId = 0;
    money.tempMoney = 0;
    document.querySelector('.ui_btn_yesno').style.display = "none";
    document.querySelector('.ui_moneyspend').style.display = "none";
}


//-------------------- Debug --------------------

document.addEventListener("keydown",async (e) => {
    if(e.keyCode == 96){
//        console.log(module.cases);
    }
});