let canvas = document.getElementById("canvas1");
let ctx = canvas.getContext("2d");



for(let y = 0; y <=300; y += 150){
    for(let x=0; x<800; x+=100){
        ctx.fillRect(x, y, 50, 20)
    }
    
}

canvas = document.getElementById("canvas2");
ctx = canvas.getContext("2d");
let x = 0;
for(let y = 100; y < 800; y += 100){

    while(x < y){
        ctx.fillRect(x, y, 50, 20)
        x += 100;
    };
    x = 0;
    
}

canvas = document.getElementById("canvas3");
ctx = canvas.getContext("2d");


for(let y = 0; y < 800; y += 100){

    for(let x = 0; x < 800; x += 100){
        if(x == y){
            continue
        } else{
            ctx.fillRect(x, y, 50, 20)
        }
        
    }
    
    
}

canvas = document.getElementById("canvas4");
ctx = canvas.getContext("2d");


let sk = 0;
for(let y = 0; y < 800; y += 100){

    for(let x = 0; x < 800; x += 200){
        
        ctx.fillRect(x + sk, y, 100, 100)
        
        
    }
    if (sk==0){
        sk += 100
    } else{
        sk = 0
    }
    
    
}