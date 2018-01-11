window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    //ctx.drawImage(document.getElementById("img"),0,0);
    createTiles();
    addEventListener('click', clicked, false); 
    let a = new State(tiles, null, 0);
}

let openList = new Array();
let closedList = new Array();
function a() {
    let a = new State(tiles, null, 0);
    openList.push(a);
   
    while (openList.length > 0) {
        
            var smallest = openList[0];
            for (var i = 0; i > openList.length; i++) {
                if (smallest.f > openList[i].f) {
                    smallest = openList[i];
                }
            } 
            if (smallest.h == 0) {
                break;
            }
            let arr = smallest.simulateNext(openList, closedList);
            closedList.push(smallest);
            remove(openList, smallest);
            for (var i = 0; i < arr.length; i++) {
                openList.push(arr[i]);
            }
            
           
            


    }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}


function clicked(ev) {
    var x = ev.clientX - document.getElementById("canvas").offsetLeft;
    var y = ev.clientY - document.getElementById("canvas").offsetTop;
    if (x < 900) {
        xpos = Math.floor(x / 300);
    } else {
        return;
    }
    if (y < 900) {
        ypos = Math.floor(y / 300);
    } else {
        return;
    }
    swapPos(xpos, ypos);
}
let tiles = new Array();
var counter = 0;

function createTiles(){
    
    var counter=0;
    var ctx = document.getElementById("canvas").getContext("2d");
    var img = document.getElementById("img");
    
    for(var i=0;i<3;++i){
        for(var j=0;j<3;j++){
            var temp = new Tile();
            temp.addinfo(i,j,counter, ctx,img);
            temp.setUp();
            tiles.push(temp); 
            console.log("created one");
            
            ++counter;
           
        }
    }
    scramble();
}

function scramble(){
    let usedPlaces = Array();
    
    for (var i = 0; i < 9; ++i){
        do {
            var a = Math.floor(Math.random() * 9);
        } while (check(a, usedPlaces));
        console.log(usedPlaces);
        tiles[i].setPosition(Math.floor(a / 3), a % 3);
        usedPlaces.push(a);
        console.log("used " + a)
    }
    reloadAll();

}
function check(a, arr) {
    for (var i = 0; i <= arr.length; i++){
        if (arr[i] == a) {
            return true;
        }
    }
    return false;
}
function reloadAll() {
    for (var i = 8; i >= 0; i--) {
        tiles[i].setUp(); 
    }
    if (checkforwin()) {
      
        document.getElementById("canvas").getContext("2d").drawImage(document.getElementById("img"), 0, 0);
    }
    document.getElementById("counter").innerHTML = counter + " Züge"
}
function swapPos(xpos, ypox) {
    
    for (var i = 0; i < 9; ++i) {
        
        if ((tiles[i].xpos == xpos) && (tiles[i].ypos == ypos)) {
            console.log(tiles[i].showInfo());
            if (hasWhiteTile(i)) {
                var xtemp = tiles[0].xpos;
                var ytemp = tiles[0].ypos;
                counter++;
                tiles[0].xpos = tiles[i].xpos;
                tiles[0].ypos = tiles[i].ypos;

                tiles[i].xpos = xtemp;
                tiles[i].ypos = ytemp;
                reloadAll();
                break;
            }
        }
    }
}
function hasWhiteTile(i) {
    if ((tiles[i].xpos - 1 == tiles[0].xpos) && (tiles[i].ypos == tiles[0].ypos)) {
        return true;
    }
    if ((tiles[i].xpos + 1 == tiles[0].xpos) && (tiles[i].ypos == tiles[0].ypos)) {
        return true;
    }
    if ((tiles[i].xpos == tiles[0].xpos) && (tiles[i].ypos +1 == tiles[0].ypos)) {
        return true;
    }
    if ((tiles[i].xpos == tiles[0].xpos) && (tiles[i].ypos -1 == tiles[0].ypos)) {
        return true;
    }
    return false;
}
function checkforwin() {
    for (var i = 0; i < 9; ++i) {
        var a = tiles[i].ypos * 3 + tiles[i].xpos;
        console.log("tile: " + tiles[i].number + "is at: " + a);
        if (a != tiles[i].number) {
            return false;
        }
    }
    return true;
}
function reset() {
    counter = 0;
    scramble();
}
function remove(array, element) {
    const index = array.indexOf(element);

    if (index !== -1) {
        array.splice(index, 1);
    }
}
//----------Classes-------------

class Tile {

    constructor(tiles) {
        this.tiles = tiles;
        for (var i = 0; i < 9; i++) {

        }
    }


    addinfo(ypos, xpos, number, ctx, img) {
        this.number = number; //Number used to identify the piece
        this.xpos = xpos; // Current Position in the array
        this.ypos = ypos; // Current Position in the array
        this.ctx = ctx; //Context for drawing on the Canvas
        this.img = img; //Img to be used
        this.picxpos = xpos;
        this.picypos = ypos;
        console.log(number + " " + ypos + " " + xpos);
    }
    setUp() {
        if (this.number == 0) {
            
            console.log("drawing white on " + this.xpos + " and " + this.ypos);
            this.ctx.strokeStyle = "#000000";
            this.ctx.rect(this.picxpos * 300, this.picypos * 300, 300, 300);
            this.ctx.stroke();
            this.ctx.fillStyle = "rgb(255,255,255)";
            this.ctx.fillRect(this.xpos*300, this.ypos*300, 300, 300);
            console.log("white");
        }
        else {
            //draw picture part
            //                  Image       xpos of original    yposof original height width    xpos and ypos on canvas 
            this.ctx.drawImage(this.img, this.picxpos * 300, this.picypos * 300, 300, 300, this.xpos * 300, this.ypos * 300, 300, 300);
            this.ctx.rect(this.picxpos * 300, this.picypos * 300, 300, 300);
            this.ctx.stroke();
            console.log("Picture");
        }

    }
    setPosition(ypos, xpos) {
        this.xpos = xpos;
        this.ypos = ypos;
        console.log(this.number + " has: x = " + this.xpos + " vs " + this.picxpos + " y = " + this.ypos + " vs " + this.picypos);
    }
    showInfo() {
        return "----------\nNumber: "+this.number +"\nXpos: "+this.xpos +"\nYpos: "+this.ypos+"\n----------"
    }

}


//-----------Autosolve Attempt1
class State {

    constructor(current, prev , stepssofar){
    
        this.current = current;
        this.g = stepssofar;
        this.prev = prev;
        this.h = this.calculateHamming();
        this.f = this.h + this.g;
    }

    calculateHamming() {
        var dist = 0;
        for (var i = 0; i < 9; i++) {
            //calculate hamming dist for one single tile
            
            if ((this.current[i].xpos + (this.current[i].ypos * 3)) != this.current[i].number) {
                var a = this.current[i].number;

                var x = a % 3;
                var y = Math.floor(a / 3);
               
                dist = dist + Math.abs((this.current[i].xpos - y) + (this.current[i].ypos - x));
            }

        }
        
        return dist;
    }

    simulateNext(openList, closedList) {
        let a = Array();
        for (var i = 0; i < 9; i++) {
            if (this.hasWhiteTile(i, this.current)) {
                var add = true;
                let x = new State(this.swapPos(i), this, this.g + 1);

                if (add) {
                    a.push(x);
                }
                
               
            }
        }//---------------------
        return a;
    }
    swapPos(i) {
        var tiles = this.current;
        var xtemp = tiles[0].xpos;
        var ytemp = tiles[0].ypos;
                    
        tiles[0].xpos = tiles[i].xpos;
        tiles[0].ypos = tiles[i].ypos;

        tiles[i].xpos = xtemp;
        tiles[i].ypos = ytemp;

        return tiles;
    }
    hasWhiteTile(i, tiles) {
        if ((tiles[i].xpos - 1 == tiles[0].xpos) && (tiles[i].ypos == tiles[0].ypos)) {
            return true;
        }
        if ((tiles[i].xpos + 1 == tiles[0].xpos) && (tiles[i].ypos == tiles[0].ypos)) {
            return true;
        }
        if ((tiles[i].xpos == tiles[0].xpos) && (tiles[i].ypos + 1 == tiles[0].ypos)) {
            return true;
        }
        if ((tiles[i].xpos == tiles[0].xpos) && (tiles[i].ypos - 1 == tiles[0].ypos)) {
            return true;
        }
        return false;
    }
    

}