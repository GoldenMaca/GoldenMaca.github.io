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
let coldMoves = 0;
let cold = false;
let randomKill = 0;

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
    if (cold){
        coldMoves++;
        if (coldMoves >= 4){
            print("\t\nYou have been exposed to the cold for too long and have died of hypothermia. You lose!");
            food = false;
            ID = false;
            key = false;
            waitThenCall(start);
        }
    }
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
                if (cold){
                    coldMoves--;
                }
            }
        }
        waitForInput(processInput);
    }
}

function locationB() {
    if (cold){
        coldMoves++;
        if (coldMoves >= 4){
            print("\t\nYou have been exposed to the cold for too long and have died of hypothermia. You lose!");
            food = false;
            ID = false;
            key = false;
            waitThenCall(start);
        }
    }
    clear();
    print("\t\nYou are in the Cafeteria!");
    print("\t\nWould you like to get some food?");
    print("\t\nWhere do you want to go next? Say one of these choices:" +
        "\t\n\t\tget food\t\n\t\tBridge\t\n\t\tDeck");
    deckDiscovered = true;
    function processInput(input){
        if (input.toLowerCase() === "get food" || input.toLowerCase() === "getfood") {
            if (!food) {
                food = true;
            }
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
            if (cold){
                coldMoves--;    
            }
        }
    }
    waitForInput(processInput);
}

function locationC() {
    
    clear();
    print("\t\nYou are in the Engine Room!")
    if (cold){
        print("\t\nBy a spark of luck, the engines are still hot and provide some heat to warm you up, you are no longer cold.")
        cold = false;
    }
    if (cold){
        coldMoves++;
        if (coldMoves >= 4){
            print("\t\nYou have been exposed to the cold for too long and have died of hypothermia. You lose!");
            food = false;
            ID = false;
            key = false;
            waitThenCall(start);
        }
    }
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
            if (cold){
                coldMoves--;    
            }
        }
    }
    waitForInput(processInput);
}

function locationD() {
    if (cold){
        coldMoves++;
        if (coldMoves >= 4){
            print("\t\nYou have been exposed to the cold for too long and have died of hypothermia. You lose!");
            food = false;
            ID = false;
            key = false;
            waitThenCall(start);
        }
    }
    clear();
    print("\t\nYou are on the Deck!");
    print("\t\nWhere do you want to go next? Say one of these choices:" +
        "\t\n\t\tExplore\t\n\t\tCafeteria\t\n\t\nMap (to see discovered rooms)\t\n\t\nSwim (to get a fishing rod)");
            
    function processInput(input){
        randomKill = Math.floor(Math.random() * 5);
        if (randomKill === 0){
            print("\t\nA sudden storm hits the ship and you get swept overboard and drown. You lose!");
            food = false;
            ID = false;
            key = false;
            waitThenCall(start);
        }
        
        if (input.toLowerCase() === "explore") {
            print("\nYou look around the deck and around the cargo. After a while, you see something shiny wedged under a metal panel. You found the key! You can now escape the ship!");
            key = true;
            locationD();
        }else if (input.toLowerCase() === "cafeteria") {
            locationB();
        } else if (input.toLowerCase() === "swim") {
            takeASwim();
        } else if (input.toLowerCase() === "map") {
            if (allowMap == true) {
                drawMap();
            } else {
                print("\t\nYou don't have a map yet! Explore the ship to find it.");
                stayHere();
                waitThenCall(locationD);
                if (cold){
                    coldMoves--;
                }
            }
        } else {
            stayHere();
            waitThenCall(locationD);
            if (cold){
                coldMoves--;    
            }
        }
        waitForInput(processInput);
    }
    
    

function locationE() {
    if (cold){
        coldMoves++;
        if (coldMoves >= 4){
            print("\t\nYou have been exposed to the cold for too long and have died of hypothermia. You lose!");
            food = false;
            ID = false;
            key = false;
            waitThenCall(start);
        }
    }
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
                    if (cold){
                        coldMoves--;
                    }
                }
        } else {
            stayHere();
            waitThenCall(locationE);
            if (cold){
                coldMoves--;    
            }
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

function takeASwim(){
    print("\t\nYou jump off of the deck into the ocean. The water is freezing and you start to shiver. You catch sight of the fishing rod");
    print("\t\nSwim to it or Swim back to the ship?");
    print("\t\nA or B?")
    if (input.toLowerCase() === "a"){
        print("\t\nYou swim to the fishing rod and grab it. You can now use it to catch some fish for food!");
        if (!food) {
            food = true;
        }
        print("\t\nYou swim back to the ship with the fishing rod. The only issue is that you are now freezing and need to find a source of heat, and hurry!");

        locationD();
        cold = true;
    } else if (input.toLowerCase() === "b"){
        print("\t\nYou swim back to the ship, but you get caught in some fishing nets and drown. You lose!");
        food = false;
        ID = false;
        key = false;
        waitThenCall(start);
    } else {
        stayHere();
        waitThenCall(takeASwim);
    }
}
}