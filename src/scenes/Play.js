class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        this.board = [];
        this.terrain = [];
        this.pieces = [];
        this.p1active = 0;
        this.p2active = 0;
        this.graphics = this.add.graphics();
        this.objectBoard = this.add.group();

        this.graphics.fillStyle(0x40c72c, 1); //Color const
        this.graphics.fillRect(0, 0, 57, 57); //Needs cleanup, should be easy to determine where squares are so that mouse controls can be easily implemented
        this.graphics.generateTexture("squareTextureGreen", 57, 57)

        this.graphics.fillStyle(0x71acf0, 1); //Color const
        this.graphics.fillRect(0, 0, 57, 57); //^
        this.graphics.generateTexture("squareTexture", 57, 57)

        this.graphics.fillStyle(0x000000, 1); //Should be a const?
        this.graphics.fillRect(0, 0, 57, 26.5); //310 + 60i, 55+60j
        this.graphics.generateTexture("blackUnit", 57, 26.5)

        this.graphics.fillStyle(0xffffff, 1); //Should be a const?
        this.graphics.fillRect(0, 0, 57, 26.5); //310 + 60i, 25+60j
        this.graphics.generateTexture("whiteUnit", 57, 26.5)

        this.graphics.destroy();


        for (let i = 0; i < 11; i++) {
            this.board[i] = [];
            this.terrain[i] = [];
            this.objectBoard[i] = [];
            for (let j = 0; j < 9; j++) {
                this.board[i][j] = 0;
                if (([1, 2].includes(i) && [1, 2].includes(j)) || [8, 9].includes(i) && [6, 7].includes(j)) {
                    this.terrain[i][j] = 1

                    var square = new BoardSquare(this, boardOffestX + 60 * i, boardOffsetY + 60 * j, "squareTextureGreen", 0)
                    this.objectBoard[i].push(square)
                } else {
                    this.terrain[i][j] = 0

                    var square = new BoardSquare(this, boardOffestX + 60 * i, boardOffsetY + 60 * j, "squareTexture", 0)
                    this.objectBoard[i].push(square)

                }
            }
        }
        this.board[6][5] = new Unit(this, boardOffestX + 60 * 6, boardOffsetY - unitOffsetY + 60 * 5, "whiteUnit", 0, 0, 6, 5, "calv1")
        this.board[5][5] = new Unit(this, boardOffestX + 60 * 5, boardOffsetY - unitOffsetY + 60 * 5, "whiteUnit", 0, 0, 5, 5, "calv2")
        this.board[5][4] = new Unit(this, boardOffestX + 60 * 5, boardOffsetY + unitOffsetY + 60 * 4, "blackUnit", 0, 1, 5, 4, "calv3")
        this.board[6][4] = new Unit(this, boardOffestX + 60 * 6, boardOffsetY + unitOffsetY + 60 * 4, "blackUnit", 0, 1, 6, 4, "calv4")
        this.board[2][2] = new Unit(this, boardOffestX + 60 * 2, boardOffsetY + unitOffsetY + 60 * 2, "blackUnit", 0, 1, 2, 2, "archer")
        this.pieces.push(this.board[6][5]) //Secondary peice array allows for quickly iterating over all pieces without iterating over the whole board while
        this.pieces.push(this.board[5][5]) //   the board array allows for simple adjacency checking without iterating over the entire peice array 
        this.pieces.push(this.board[5][4]) //The peice array functions like an array of pointers which I really like too  
        this.pieces.push(this.board[6][4])
        this.pieces.push(this.board[2][2])

        this.determineBonuses();









        // Draw a hand of card for each player, player 1 will begin so I will show their hand first

        //Cards should be sprites as it will make it easy to instantiate them and move them around

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



    determineBonuses() {
        console.log("________")
        for (let i = 0; i < this.pieces.length; i++) {
            this.support(this.pieces[i].boardX, this.pieces[i].boardY)
            this.flank(this.pieces[i].boardX, this.pieces[i].boardY)
            this.attack(this.pieces[i].boardX, this.pieces[i].boardY)
            this.checkHighGround(this.pieces[i].boardX, this.pieces[i].boardY)
        }

    }

    support(i, j) {
        if (this.board[i - 1][j] != 0 && this.board[i - 1][j] != undefined) {
            if (this.board[i - 1][j].player == this.board[i][j].player) {
                this.board[i][j].giveSupport(this.board[i - 1][j])
            }
        }
        if (this.board[i][j - 1] != 0 && this.board[i][j - 1] != undefined) {
            if (this.board[i][j - 1].player == this.board[i][j].player) {
                this.board[i][j].giveSupport(this.board[i][j - 1])
            }
        }
        if (this.board[i + 1][j] != 0 && this.board[i + 1][j] != undefined) {
            if (this.board[i + 1][j].player == this.board[i][j].player) {
                this.board[i][j].giveSupport(this.board[i + 1][j])
            }
        }
        if (this.board[i][j + 1] != 0 && this.board[i][j + 1] != undefined) {
            if (this.board[i][j + 1].player == this.board[i][j].player) {
                this.board[i][j].giveSupport(this.board[i][j + 1])
            }
        }
    }

    flank(i, j) {
        if (this.board[i - 1][j - 1] != 0 && this.board[i - 1][j - 1] != undefined) {
            if (this.board[i - 1][j - 1].player != this.board[i][j].player) {
                this.board[i][j].applyFlank(this.board[i - 1][j - 1])
            }
        }
        if (this.board[i - 1][j + 1] != 0 && this.board[i - 1][j + 1] != undefined) {
            if (this.board[i - 1][j + 1].player != this.board[i][j].player) {
                this.board[i][j].applyFlank(this.board[i - 1][j + 1])
            }
        }
        if (this.board[i + 1][j - 1] != 0 && this.board[i + 1][j - 1] != undefined) {
            if (this.board[i + 1][j - 1].player != this.board[i][j].player) {
                this.board[i][j].applyFlank(this.board[i + 1][j - 1])
            }
        }
        if (this.board[i + 1][j + 1] != 0 && this.board[i + 1][j + 1] != undefined) {
            if (this.board[i + 1][j + 1].player != this.board[i][j].player) {
                this.board[i][j].applyFlank(this.board[i + 1][j + 1])
            }
        }

    }

    attack(i, j) {
        if (this.board[i - 1][j] != 0 && this.board[i - 1][j] != undefined) {
            if (this.board[i - 1][j].player != this.board[i][j].player) {
                this.board[i][j].fight(this.board[i - 1][j])
            }
        }
        if (this.board[i][j - 1] != 0 && this.board[i][j - 1] != undefined) {
            if (this.board[i][j - 1].player != this.board[i][j].player) {
                this.board[i][j].fight(this.board[i][j - 1])
            }
        }
        if (this.board[i + 1][j] != 0 && this.board[i + 1][j] != undefined) {
            if (this.board[i + 1][j].player != this.board[i][j].player) {
                this.board[i][j].fight(this.board[i + 1][j])
            }
        }
        if (this.board[i][j + 1] != 0 && this.board[i][j + 1] != undefined) {
            if (this.board[i][j + 1].player != this.board[i][j].player) {
                this.board[i][j].fight(this.board[i][j + 1])
            }
        }
    }

    checkHighGround(i, j) {
        if (this.terrain[i][j] == 1) {
            this.board[i][j].highGround();
        }
    }



}