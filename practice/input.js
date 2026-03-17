
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

var right = true;
var up = false;
var x = 0;
var y = 0;




function makeRect(color = "red"){
    ctx.clearRect(0, 0, 800, 500);

    ctx.fillStyle = color;
    ctx.fillRect(x, y, 50, 50);
    
    requestAnimationFrame(makeRect);
}

makeRect();

document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowRight') {
        if (x < 750) {
          x += 1; 
        }
    } else if (event.code === 'ArrowLeft') {
        if (x > 0) {
          x -= 1; 
        }
    } else if (event.code === 'ArrowUp') {
        if (y > 0) {
          y -= 1; 
        }
    } else if (event.code === 'ArrowDown') {
        if (y < 450) {
          y += 1; 
        }
        
    }
    
    
}); 