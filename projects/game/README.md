var food = false; - If you have the food to survive the trip
var ID = false;
var key = false;

let bridgeDiscovered = true;
let cafeteriaDiscovered = true;
let engineRoomDiscovered = true;
let libraryDiscovered = true;
let deckDiscovered = false;
let allowMap = false;
let coldMoves = 0;
let cold = false;
let randomKill = 0;




#Day 1
Today, started by adding all the necessary files and folders to the projects page. This mainly consisted of copy and pasting the code from Mr Chris' file. This was all I did today.

#Day 2
Today I have a plan:
[1] - Style the page to my liking
[2] - Make the functions in js be more towards my theme
[3] - Have a working solid base for my expansion

Im thinking for the map:

Bridge -> Cafeteria, Engine Room, Library
Cafeteria -> Bridge, Deck
Engine Room -> Cabin, Bridge, Find ID
Library -> Engine Room, Bridge
Deck -> Cafeteria

Need to get key from captains cabin, and paper record stating that he lost his ID on deck somewhere. 
You need to go get the ID and Key to control the Tanker and stear it to land. When you reach a little Island, you get onto a plane and escape.

#Day 3
I did not style the page much before, I decided to do that last. 
I changed all the functions today and removed the customized gameplay from Chris' origional file.

#Day 4
I moved all of the things I needed from tankership.js due to errors, to see if it would still work. It did and I therefore kept tankership.js out of this.
To simplify importing and expoerting variable, I moved the contents I needed from the other js files into the game.js file.
I still haven't styled the page to my liking yet and I am running out of time.

#Day 5
I am having a lot of errors and Im not even sure how to fix them. I asked Ethan to look over my file to see for me and he said he would, and then never did. 
I figured out an issue with my 'get food' input in the cafeteria, I thought it was broken but it was just that I was accidentally doing 'locationB();' instead of 'waitThenCall(locationB());'

#Day 6
I noticed my commits arent working but Mr Chris reassured me they would be saved locally. 
I still havent solved some of the errors, mostly having to do with the input 'swim' on the deck leading to the 'takeASwim();' funciton. Pretty much ALL of the 'look around' inputs are broken and Im not sure how to fix it.
I am going to submit it as is, but I hope that I can fix these issues because I want to play my game.

#Day 7(after submission)
I think I fixed some of my issues and i added a parameter to 'waitThenCall();' that allows to wait longer, for example if I have a longer text.  There are a bunch of issues that Im so confused on and I am going to ask Mr Chris and Ethan for help.