class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }
    
    create() {
        // Draw the board (board state will be stored in data and not using sprites)

        // Draw a hand of card for each player, player 1 will begin so I will show their hand first

        //Players will make their "setup moves"

        //Turn is passed back to player 1 
    }
    update() {
        //Current player will be set and used as a variable to avoid nesting conditionals

        //Game will wait for mouse actions

        //Players may select a unit and move it, deploy a unit from their hand, or retreat a unit into their hand

        //Players will be able to make a set number of moves no matter the number of troops they have commited 

        //Check for move counter will pass the turn to the other player

        //After both players have gone units on the board will fight 

        //Troop positions will be stored as row and column allowing for distances to be calculated simply

        //Most calculations will be done with brute force since I don't currently plan on adding a computer player that would need to look ahead

        //Units will first update combat values based on supporting units, flanking, or high ground

        //Units will then compare combat values and fight

        //Turn will be passed back to player 1 

        //Loop will continue until a player has no more units on the board


    }

    

}