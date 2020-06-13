import {loadJSON, loadImg} from './loaders.js'
import {buffer, ctx, sleep, money, module, ressources} from './init.js'
import {showOverlay} from './ui.js';


export class FileManager {
    constructor(){
        loadJSON("src/data/module.json").then(r => this.moduleSheet=r);
        loadImg('src/media/module.png').then(img => this.moduleTiles=img);
    }
}

export class Money {
    constructor(amount){
        this.amount = amount;
        this.tempMoney = 0;
        this.profit = 0;
        this.updateMoney();
        this.updateProfit();
    }
    
    change(amount){
        if((this.amount + amount) >= 0){
            this.amount += amount;
            this.updateMoney();
        }
    }

    updateMoney(){
        document.querySelector('.overall_money').innerHTML = "<span>$</span>"+this.amount;
    }
    
    updateProfit(){
        if(this.profit < 0) document.querySelector('.money_sec').style.color = "#842b2b";
        else document.querySelector('.money_sec').style.color = "#327b28";
        document.querySelector('.money_sec').innerHTML = this.profit;
    }
}

export class Module extends FileManager {
    constructor(){
        super(); //Call FileManager to access moduleSheet
        this.cases = new Array();
        this.temp = new Array();
        this.modifType = "idle";
    }
    
    add(arg,x,y,id,rotation){
        this[arg][x+","+y] = {
            id: id,
            rotation: rotation,
            delay: this.moduleSheet[id].delay,
            costPerCycle: this.moduleSheet[id].costPerCycle
        };
        
        if(arg=="cases") {
            if(id==1 && !this.cases[x+","+y].hasOwnProperty('spawnObject')) this[arg][x+","+y].spawnObject = "none";
            this.cases[x+","+y].cycle = setInterval(this.costPerCycle,this.cases[x+","+y].delay*1000,x,y,this);
            if(this.cycle==undefined) this.cycle = setInterval(this.profitCycle,3001);
        }
    }
    
    delete(arg,x,y){
        delete this[arg][x+","+y];
    }
    
    exist(arg,x,y){
        if(this[arg][x+","+y]==undefined) return false;
        else return true;
    }
    
    isEmpty(arg){
        if(Object.keys(this[arg]).length <= 0) return true;
        else return false;
    }
    
    getPrice(id){
        return this.moduleSheet[id].price;
    }
    
    draw(id,x,y){
        var coord = this.moduleSheet[id].bufferPos;
        ctx.drawImage(buffer,coord[0]*32,coord[1]*32,32,32,x*32,y*32,32,32);
    }
    
    changeSpawnType(e){
        if(this.modifType=="idle" && !this.isEmpty("temp")){
            showOverlay('spawnSelector');
            var el = Object.keys(this.temp);
            this.cases[el].spawnObject = e.id.split('_')[1];
            document.querySelector('.overlay_starter').children[3].querySelector('img').src = "src/media/ressources/"+this.cases[el].spawnObject+".png";
        }
    }

    rotate(x,y,arrow=null){
        ctx.clearRect(x*32,y*32,32,32);
        ctx.save();
        ctx.translate((x*32)+16,(y*32)+16);
        ctx.rotate((this.cases[x+','+y].rotation*90)*(Math.PI/180));
        ctx.translate(-(x*32)-16,-(y*32)-16);
        this.draw(this.cases[x+','+y].id,x,y);
        if(arrow!=null) this.draw("arrow",x,y);
        ctx.restore();
    }
    
    costPerCycle(x,y,that){
        if(that.exist("cases",x,y) && that.cases[x+","+y].delay!=0 && (that.cases[x+","+y].spawnObject==undefined || that.cases[x+","+y].spawnObject!="none")){
            money.profit -= that.cases[x+","+y].costPerCycle;
            ressources.new(that.cases[x+","+y].spawnObject,x*32,y*32, that.cases[x+","+y].rotation);
            requestAnimationFrame(ressources.spawnAnim);
        }
    }
    
    profitCycle(){
        money.change(money.profit);
        money.updateProfit();
        money.profit = 0;
    }
}


export class Ressources {
    constructor(){
        this.pool = new Array();
        this.vel = 40;
        this.id = 0;
    }
    
    new(type, x, y, rotation){
        this.pool.push({type: type, x: x , y: y, distance: 0, rotation: rotation});
        if(rotation==0 || rotation==3) this.point = [10,10];
        else if(rotation==1 || rotation==2) this.point = [22,22];
        
        this.selected = this.pool.length-1;
        this.id += 1; 
    }
    
    spawnAnim(){
        let rsrc = ressources.pool[ressources.selected], moduleUnder=undefined, coord = module.moduleSheet[rsrc.type].bufferPos,
        x = Math.floor((rsrc.x+ressources.point[0])/32), y = Math.floor((rsrc.y+ressources.point[1])/32);
        
        if(module.exist("cases",x,y)) moduleUnder = module.cases[x+','+y].id;
        
        if(rsrc.distance.toFixed(2) < 32){
            if(moduleUnder==1) module.rotate(x,y);
            
            else if(moduleUnder==2){
                module.rotate(x,y);
                money.change(250);
                money.profit += 250;
                ressources.pool.splice(ressources.selected,1);
                return;
            }
            
            else ctx.clearRect((rsrc.x+9),(rsrc.y+9),14,14);
            
            if(rsrc.rotation==0) rsrc.y += ressources.vel * 1/60;
            else if(rsrc.rotation==1) rsrc.x -= ressources.vel * 1/60;
            else if(rsrc.rotation==2) rsrc.y -= ressources.vel * 1/60;
            else if(rsrc.rotation==3) rsrc.x += ressources.vel * 1/60;
            rsrc.distance += ressources.vel * 1/60;
            
            ctx.drawImage(buffer,((coord[0]*32)+10),((coord[1]*32)+10),12,12,(rsrc.x+10),(rsrc.y+10),12,12);
            
            requestAnimationFrame(ressources.spawnAnim);
        }else{
            rsrc.y = Math.floor(rsrc.y);
            rsrc.distance = 0;
        }
    }
}