
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let x = 0;
let y = 0;

// Velocity from input.js (global)
const speed = 3;


// Boundary bounce
function bounce() {
  if (x <= 0) {
    x = 0;
    vx = Math.abs(vx); // reverse direction
  } else if (x >= 750) {
    x = 750;
    vx = -Math.abs(vx);
  }
  if (y <= 0) {
    y = 0;
    vy = Math.abs(vy);
  } else if (y >= 450) {
    y = 450;
    vy = -Math.abs(vy);
  }
}

function makeRect(color = "red"){
    ctx.clearRect(0, 0, 800, 500);
    
    // Update position
    x += vx;
    y += vy;
    
    // Bounce on edges
    bounce();
    
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 50, 50);
    
    requestAnimationFrame(makeRect);
}

makeRect();