
let name = prompt("请输入的名字");
console.log("Hello, " + name + "!");

function addToBody(text){
    document.body.innerHTML += "<p>" + text + "</p>";
}

addToBody("Hello, " + name + "!");

let temp = prompt("请输入一个数字");

if(temp<=32){
    addToBody("It's very cold!");
}

addToBody("The temperature is " + temp + " degrees.");