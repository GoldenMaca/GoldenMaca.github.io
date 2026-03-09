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
        }
        if (input.toLowerCase() === "engine room") {
            locationC();
        }
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
        "\n\tLook around\n\tBridge\n\tLibrary");
            
    function processInput(input){
        if (input.toLowerCase() === "look around") {
            print("\nYou look around the engine room and find a small panel that you can open. Inside, you find the captain ID card!");
            ID = true;
            locationC();
        }
        if (input.toLowerCase() === "bridge") {
            locationA();
        }
        if (input.toLowerCase() === "library") {
            locationE();
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

function locationE() {
    clear();
    print("\nYou are in the Library!");
    print("\nWhere do you want to go next? Say one of these choices:" +
        "\n\tLook around\n\tEngine Room");
    
    function processInput(input){
        if (input.toLowerCase() === "look around") {
            print("\nYou look around the library and find a book about the ship. Inside, you find a map of the ship that shows where all the rooms are!");
            locationE();
        }
        if (input.toLowerCase() === "engine room") {
            locationC();
        }
        else {
            stayHere();
            waitThenCall(locationE);
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

function endgame() {
    print("\nYou now have control of the vessel, you can set the course, but which direction will you go? North, South, East, or West?");
    
    function processInput(input){
        if (input.toLowerCase() === "north") {
            print("\nYou set the course to North, but you end up crashing into an iceberg and sinking. You lose!");
            gameActive = false;
        }
        if (input.toLowerCase() === "south") {
            print("\nYou set the course to South, but you end up crashing into a reef and sinking. You lose!");
            gameActive = false;
        }
        if (input.toLowerCase() === "east") {
            print("\nYou set the course to East, but you end up crashing into a pirate ship and getting captured. You lose!");
            gameActive = false;
        }
        if (input.toLowerCase() === "west") {
            print("\nYou set the course to West, and you end up finding a nearby island where you find an airstrip! You find a plane and escape. You win!");
            gameActive = false;
        }
        else {
            stayHere();
            waitThenCall(endgame);
        }
    }
    waitForInput(processInput);
}

