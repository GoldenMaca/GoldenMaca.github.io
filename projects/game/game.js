let gameActive = true; //this variable is required. 
                       //to stop the game, set it to false.

//Declare your other global variables here
var food = false;
var ID = false;
var key = false;

//BUGS 
//Look around function doesnt work for any of them, library, deck, or engine room.
//Idk if map works or not, but it should work fine. Idk because I cant find it in library.
//get food doesnt work in cafeteria.

let bridgeDiscovered = true;
let cafeteriaDiscovered = true;
let engineRoomDiscovered = true;
let libraryDiscovered = true;
let deckDiscovered = false;
let allowMap = false;

//If you need, add any "helper" functions here

function drawMap(){
    let map = ``;

    if(bridgeDiscovered){
        map += `
                                         ----------
                                         | Bridge |
                                         ----------
                                             |`;
    }
    if(libraryDiscovered && cafeteriaDiscovered && engineRoomDiscovered){
        map += `
        -----------    -------------     --------------
        | Library |----| Cafeteria |----| Engine Room |
        -----------    -------------     --------------
                           |`;
    }else if(libraryDiscovered && bridgeDiscovered){
        map += `
        -----------    -----------
        | Library |----| Bridge |
        -----------    -----------
                           |`;
    }else if(engineRoomDiscovered && bridgeDiscovered){
        map += `
                       -----------    -------------
                       | Bridge |----| Engine Room |
                       -----------    -------------
                           |`;
    }else{
        map += `
                       -----------
                       | Bridge |
                       -----------
                           |`;
    }
    map += `
                      --------
                      | Deck |
                      --------`;
    

    
        printAscii(map);
    
}







//Make one function for each location
function locationA() {

    if (food && ID && key) {
        clear();
        print("\t\nYou have all the items you need to escape the ship! You use the key to open the escape pod and get out of the ship.");
        endgame();
        
    }
    else {
        clear();
        print("\t\nYou are in the Bridge!");
        print("\t\nWhere do you want to go next? Say one of these choices:" +
            "\t\nCafeteria\t\nEngineRoom\t\nLibrary\t\nMap (to see discovered rooms)");
        
        function processInput(input){
            if (input.toLowerCase() === "cafeteria") {
                locationB();
            }else if (input.toLowerCase() === "engineroom") {
                locationC();
            }else if (input.toLowerCase() === "library") {
                locationE();
            } else if (input.toLowerCase() === "map"){
                if (allowMap == true) {
                    drawMap();
                } else {
                    print("\t\nYou don't have a map yet! Explore the ship to find it.");
                    stayHere();
                    waitThenCall(locationA);
                }
            }else {
                stayHere();
                waitThenCall(locationA);
            }
        }
        waitForInput(processInput);
    }
}

function locationB() {
    clear();
    print("\t\nYou are in the Cafeteria!");
    print("\t\nWould you like to get some food?");
    print("\t\nWhere do you want to go next? Say one of these choices:" +
        "\t\n\t\tget food\t\n\t\tBridge\t\n\t\tDeck");
    deckDiscovered = true;
    function processInput(input){
        if (input.toLowerCase() === "get food" || input.toLowerCase() === "getfood") {
            food = true;
            print("\t\nYou pick up some food! (food obtained)");
            locationB();
        } else if (input.toLowerCase() === "bridge") {
            locationA();
        } else if (input.toLowerCase() === "deck") {
            locationD();
        } else if (input.toLowerCase() === "map"){
            if (allowMap == true) {
                drawMap();
            } else {
                print("\t\nYou don't have a map yet! Explore the ship to find it.");
                stayHere();
                waitThenCall(locationB);
            }
                            
        }else {
            stayHere();
            waitThenCall(locationB);
        }
    }
    waitForInput(processInput);
}

function locationC() {
    clear();
    print("\t\nYou are in the Engine Room!")
    print("\t\nWhere do you want to go next? Say one of these choices:" +
        "\t\n\t\tLookAround\t\n\t\tBridge\t\n\t\tLibrary");
            
    function processInput(input){
        if (input.toLowerCase() === "lookaround") {
            print("\nYou look around the engine room and find a small panel that you can open. Inside, you find the captain ID card!");
            ID = true;
            locationC();
        }else if (input.toLowerCase() === "bridge") {
            locationA();
        }else if (input.toLowerCase() === "library") {
            locationE();
        } else if (input.toLowerCase() === "map"){
            if (allowMap == true) {
                drawMap();
            } else {  
                print("\t\nYou don't have a map yet! Explore the ship to find it.");
                stayHere();
                waitThenCall(locationC);
            }  
                
        }else {
            stayHere();
            waitThenCall(locationC);
        }
    }
    waitForInput(processInput);
}

function locationD() {
    clear();
    print("\t\nYou are on the Deck!");
    print("\t\nWhere do you want to go next? Say one of these choices:" +
        "\t\n\t\tExplore\t\n\t\tCafeteria");
            
    function processInput(input){
        if (input.toLowerCase() === "explore") {
            print("\nYou look around the deck and around the cargo. After a while, you see something shiny wedged under a metal panel. You found the key! You can now escape the ship!");
            key = true;
            locationD();
        }else if (input.toLowerCase() === "cafeteria") {
            locationB();
        } else if (input.toLowerCase() === "map"){
            if (allowMap == true) {
                drawMap();
            }
            else {
                print("\t\nYou don't have a map yet! Explore the ship to find it.");
                stayHere();
                waitThenCall(locationD);
            }  
            stayHere();
            waitThenCall(locationD);
        }
    }
    waitForInput(processInput);
}

function locationE() {
    clear();
    print("\t\nYou are in the Library!");
    print("\t\nWhere do you want to go next? Say one of these choices:" +
        "\t\n\t\tLookaround\t\n\t\tEngineRoom\t\n\t\tBridge");
    
    function processInput(input){
        if (input.toLowerCase() === "lookaround") {
            print("\nYou look around the library and find a book about the ship. Inside, you find a map of the ship that shows where all the rooms are!");
            allowMap = true;
            locationE();
        }else if (input.toLowerCase() === "bridge") {
            locationA();
        
        }else if (input.toLowerCase() === "engineroom") {
            locationC();
        } else if (input.toLowerCase() === "map"){
            if (allowMap == true) {
                drawMap();
            }
                else {
                    print("\t\nYou don't have a map yet! Explore the ship to find it.");
                    stayHere();
                    waitThenCall(locationE);
                }
        } else {
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
    print("\t\nYou now have control of the vessel, you can set the course, but which direction will you go? North, South, East, or West?");
    
    function processInput(input){
        if (input.toLowerCase() === "north") {
            print("\t\nYou set the course to North, but you end up crashing into an iceberg and sinking. You lose!");
            food = false;
            ID = false;
            key = false;
            waitThenCall(start);
        }else if (input.toLowerCase() === "south") {
            print("\t\nYou set the course to South, but you end up crashing into a reef and sinking. You lose!");
            food = false;
            ID = false;
            key = false;
            waitThenCall(start);
        }else if (input.toLowerCase() === "east") {
            print("\t\nYou set the course to East, but you end up crashing into a pirate ship and getting captured. You lose!");
            food = false;
            ID = false;
            key = false;
            waitThenCall(start);
        }else if (input.toLowerCase() === "west") {
            print("\t\nYou set the course to West, and you end up finding a nearby island where you find an airstrip! You find a plane and escape. You win!");
            gameActive = false;
        }else {
            stayHere();
            waitThenCall(endgame);
        }
    }
    waitForInput(processInput);
}
