let gameActive = true; //this variable is required. 
                       //to stop the game, set it to false.

//Declare your other global variables here
let food = false;
let ID = false;
let key = false;

//If you need, add any "helper" functions here


//Make one function for each location
function locationA() {

    if (food && ID && key) {
        clear();
        print("\nYou have all the items you need to escape the ship! You use the key to open the escape pod and get out of the ship. You win!");
        endgame();
        return;
    }
    else {
        clear();
        print("\nYou are in the Bridge!");
        print("\nWhere do you want to go next? Say one of these choices:" +
            "\n\tCafeteria\n\tEngine Room\n\tLibrary");
        
        function processInput(input){
            if (input.toLowerCase() === "cafeteria") {
                locationB();
            } else {
                stayHere();
                waitThenCall(locationA);
            }
        }
        waitForInput(processInput);
    }
}

function locationB() {
    clear();
    print("\nYou are in the Cafeteria!");
    print("\nWould you like to get some food?");
    print("\nWhere do you want to go next? Say one of these choices:" +
        "\n\tGet food\n\tBridge\n\tDeck");
    
    function processInput(input){
        if (input.toLowerCase() === "get food") {
            food = true;
            locationB();
        if (input.toLowerCase() === "engine room") {
            locationC();

        if (input.toLowerCase() === "deck") {
            locationD();
        } else {
            stayHere();
            waitThenCall(locationB);
        }
    }
    waitForInput(processInput);
}

function locationC() {
    clear();
    print("\nYou are in the Engine Room!")
    print("\nWhere do you want to go next? Say one of these choices:" +
        "\n\tLook around\n\tBridge\n\tDeck");
            
    function processInput(input){
        if (input.toLowerCase() === "look around") {
            print("\nYou look around the engine room and find a small panel that you can open. Inside, you find the captain ID card!");
            ID = true;
            locationC();
        if (input.toLowerCase() === "bridge") {
            locationA();
            
        if (input.toLowerCase() === "deck") {
            locationD();
        }
        else {
            stayHere();
            waitThenCall(locationC);
        }
    }
    waitForInput(processInput);
}

function locationD() {
    clear();
    print("\nYou are on the Deck!");
    print("\nWhere do you want to go next? Say one of these choices:" +
        "\n\tExplore\n\tCafeteria");
            
    function processInput(input){
        if (input.toLowerCase() === "Explore") {
            print("\nYou look around the deck and around the cargo. After a while, you see something shiny wedged under a metal panel. You found the key! You can now escape the ship!");
            key = true;
            locationD();
        }
        if (input.toLowerCase() === "cafeteria") {
            locationB();
        }
        else {
            stayHere();
            waitThenCall(locationD);
        }
    }
    waitForInput(processInput);
}


//finally, make sure you customize this to tell it what should happen at the
//very start. For this simple example, any input will bring you
//to locationA
function start(){
    print("You've escaped prison and are stranded on this cargo ship. Can you escape before you starve? Press any key to start");

    function processInput(input){
            locationA();
    }
    waitForInput(processInput);
}
