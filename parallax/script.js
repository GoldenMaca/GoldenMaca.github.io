var m = true;
function magicify() {
    if (m == true) {
    document.getElementById("nature1").textContent = '✨✨Nature✨✨';
    document.getElementById("nature2").textContent = '✨✨Nature is beautiful.✨✨';
    document.getElementById("magic").innerHTML = 'less magic';
    m = false;
    }else{
    document.getElementById("nature1").textContent = 'Nature';
    document.getElementById("nature2").textContent = 'Nature is beautiful.';
    document.getElementById("magic").innerHTML = 'magic';
    m = true;
    }
}