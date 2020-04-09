//-------------------- Init --------------------

//Canvas + img :
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var testImg;

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

loadImg('src/media/test.png').then(img => testImg=img);


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
    var col = Math.floor((e.clientX-rect.left-5.2)/32.5625);
    var line = Math.floor((e.clientY-rect.top-5.2)/32.5625);
    placeOnCanvas(col,line);
});

function placeOnCanvas(col,line){
    if(map[line][col] == 0){
        ctx.drawImage(testImg,col*32.5625,line*32.5625,32,32);
        map[line][col] = 1;
    }else{
        alert("Not empty !");
    }
    
}


//-------------------- Provisional FN to show grid --------------------

function showGrid(){
    if(canvas.style.background!=='url("src/media/grid.png")'){
        canvas.style.background = "url(src/media/grid.png)";
    }else{
        canvas.style.background = "url(src/media/background.png)";
    }
}