
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let x = 250;
let y = 425;
let right = true;
let up = true;
let speed = 2;

function moveBall(){
    if (x > 450){
        right = false
    } else if (x < 50)[
        right = true
    ]

    if (y > 450){
        up = true
    } else if (y < 50){
        up = false
    }
    if (up == true){
        y -= speed
        speed += 0.025
    } else{
        y += speed
        speed += 0.025
    }

    if(right == true){
        x += speed
    } else{
        x -= speed
    }

    ctx.fillStyle = red;
    ctx.arc(x, y, 25, 0, 180, true);
    
    requestAnimationFrame(moveBall);
}


setInterval(moveBall, 1)

