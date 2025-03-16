/*
Ben Silver
Towers: A Stormlight Card Game 
Unsure on time spent

Artistic Cohesion:
Overall I think i did alright on this for someone who isn't an artist. I've done my best to try to maintain similar fonts and color scheme across the game. I think
I did pretty good job sticking the the source material. While I would have liked to include for unique units for the singers and also added one or two special units
that would have mostly been flair. In the source material the game Towers in simply about teaching military stratagy so by create a card/board game about two
attacking armies where players make decisions about positioning and unit composition meets that criteria well.

Components:
I made use of text components all over the place.
I made use of the graphics component to generate place holder textures for cards and to simplify creating a board.
I used the tween manager for the siliding card effect which I'm rather happy about.
I used the timer to create a simple turn timer for each player.
Finally I used groups to manage the gameObjects. This ended up working really well as I could put cards into hand groups for example allowing me to easily hide and repopulate
hand each turn

Mechanical Cohesion:
While the game is rather simple and could DEFINATLY use some proper balancing (sorry about that) I think the actual mechanics sell the fantasy of military combat well.
Players are encouraged to play around high group, flank they're enemies, create formations and customize their composition every game, in game without the need of a deck builder.

Code Structure:
For the most part I think my code structure is all right. I think all my objects are put in logical data structures such as groups for cards in hands, or in their respective board
square for pieces making it easy to work with them. The one part I struggled with was an overabundance of functions, however, while there are a lot of them, they are modular and
attempt to do only what they say they will do, delegating other tasks to other functions and avoiding messy nested if statements. I've also tried to include comments to explain 
the purpose of all my functions and and strange quirks about parts of the code base.

Creative tilt:
I will be honest, my game doesn't stand out the most visually, however, I think I did a lot of work behind the scenes that makes the game run smoothly and makes it incredibly easy
to add to. The way the code base is setup it should be very simple to add and modify features, and units. For example if I wanted to add a new unit at the moment all I would have to
do is define it's stats in the Unit.js switch statment and add it to each players hand. I would still need art however that is something that any similar project would also need, and,
even in that case, I have placeholder textures already baked into the graphics making it very simple to test new units without commiting the time to create assets. 


*/
let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: "rgb(240,181,113)",
    scene: [Menu, Play, Tutorial]
}
let game = new Phaser.Game(config)

const boardOffestX = 339;
const squareSize = 60;
const boardOffsetY = 54;
const unitOffsetY = 15;
let timer = 60;




