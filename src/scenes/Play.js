class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }
    
    create() {
        this.board = []
        this.terrain = [];
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x71acf0, 1);

        for (let i = 0; i < 11; i++) {
            this.board[i] = [];
            this.terrain[i] = [];
            for (let j = 0; j < 9; j++) {
                this.board[i][j] = 0;
                if (([1, 2].includes(i) && [1, 2].includes(j))|| [8, 9].includes(i) && [6, 7].includes(j)){
                    this.terrain[i][j] = 1
                    this.board[i][j] = 2
                    this.graphics.fillStyle(0x40c72c, 1);
                    this.graphics.fillRect(310 + 60*i, 25+60*j, 57,57);
                    this.graphics.fillStyle(0x71acf0, 1);
                } else{
                    this.terrain[i][j] = 0
                    this.graphics.fillRect(310 + 60*i, 25+60*j, 57,57);
                }
            }
        }
        this.board[0][7] = 1
        this.board[1][7] = 1
        this.board[2][7] = 1
        this.board[3][7] = 1 
        this.board[4][7] = 1 
        this.board[5][7] = 1 
        this.board[6][7] = 1 

        this.updateBoard()



        

        console.log(this.board)

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

    updateBoard(){
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] % 2 == 1 ){
                    this.graphics.fillStyle(0xffffff, 1);
                    this.graphics.fillRect(310 + 60*i, 25+60*j, 57,26.5);
                } else if (this.board[i][j] %2 == 0 && this.board[i][j] != 0){
                    this.graphics.fillStyle(0x000000, 1);
                    this.graphics.fillRect(310 + 60*i, 25+60*j+ 35, 57,21.5);
                }
            }
        }

    }

    

}