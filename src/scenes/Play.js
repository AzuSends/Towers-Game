class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        this.board = [];
        this.terrain = [];
        this.pieces = this.add.group();
        this.graphics = this.add.graphics();
        this.objectBoard = []
        this.toBeCleaned = []
        this.clickedPiece = 0
        this.turn = 0;
        this.movesPerTurn = 3;
        this.movesCurrentTurn = 0;
        this.p1Hand = this.add.group();
        this.p2Hand = this.add.group();
        this.possibleMoves = this.add.group();
        this.currPlayer = 1;
        this.peiceClicked = false
        this.graphics.fillStyle(0x40c72c, 1); //Color const
        this.graphics.fillRect(0, 0, 57, 57);
        this.graphics.generateTexture("squareTextureGreen", 57, 57)

        this.graphics.fillStyle(0x71acf0, 1); //Color const
        this.graphics.fillRect(0, 0, 57, 57); //^
        this.graphics.generateTexture("squareTexture", 57, 57)

        this.graphics.fillStyle(0x000000, 1); //Should be a const?
        this.graphics.fillRect(0, 0, 57, 26.5); //310 + 60i, 55+60j
        this.graphics.generateTexture("blackUnit", 57, 26.5)
        this.graphics.clear();

        this.graphics.fillStyle(0x000000, 0.3); //Should be a const?
        this.graphics.fillRect(0, 0, 57, 26.5); //310 + 60i, 55+60j
        this.graphics.generateTexture("blackUnitTemp", 57, 26.5)

        this.graphics.fillStyle(0xffffff, 1); //Should be a const?
        this.graphics.fillRect(0, 0, 57, 26.5); //310 + 60i, 25+60j
        this.graphics.generateTexture("whiteUnit", 57, 26.5)
        this.graphics.clear();

        this.graphics.fillStyle(0xffffff, 0.3); //Should be a const?
        this.graphics.fillRect(0, 0, 57, 26.5); //310 + 60i, 25+60j
        this.graphics.generateTexture("whiteUnitTemp", 57, 26.5)
        this.graphics.clear();

        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.fillRect(0, 0, 135, 189);
        this.graphics.generateTexture("cardTempWhite", 135, 189)
        this.graphics.clear();

        this.graphics.fillStyle(0x000000, 1);
        this.graphics.fillRect(0, 0, 135, 189);
        this.graphics.generateTexture("cardTempBlack", 135, 189)
        this.graphics.destroy();




        for (let i = 0; i < 11; i++) {
            this.board[i] = [];
            this.terrain[i] = [];
            this.objectBoard[i] = [];
            for (let j = 0; j < 9; j++) {
                this.board[i][j] = 0;
                if (([1, 2].includes(i) && [1, 2].includes(j)) || [8, 9].includes(i) && [6, 7].includes(j)) {
                    this.terrain[i][j] = 1

                    var square = new BoardSquare(this, boardOffestX + 60 * i, boardOffsetY + 60 * j, "squareTextureGreen", 0, i, j).setInteractive();
                    this.objectBoard[i].push(square)
                } else {
                    this.terrain[i][j] = 0

                    var square = new BoardSquare(this, boardOffestX + 60 * i, boardOffsetY + 60 * j, "squareTexture", 0, i, j).setInteractive();
                    this.objectBoard[i].push(square)

                }
            }
        }

        this.drawHandP1()
        this.drawHandP2()


    }
    update() {

        if (this.movesCurrentTurn == 0) {
            this.currPlayer = !this.currPlayer
            this.movesCurrentTurn = this.movesPerTurn
            this.determineBonuses()
            this.doCleanup();
        }

        //On click draw the possible moves and 


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
        for (const child of this.pieces.getChildren()) {
            this.support(child.boardX, child.boardY)
            this.flank(child.boardX, child.boardY)
            this.checkHighGround(child.boardX, child.boardY)
            this.attack(child.boardX, child.boardY)
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
                if (this.board[i][j].fight(this.board[i - 1][j])) {
                    this.toBeCleaned.push(this.board[i - 1][j])
                }
            }
        }
        if (this.board[i][j - 1] != 0 && this.board[i][j - 1] != undefined) {
            if (this.board[i][j - 1].player != this.board[i][j].player) {
                if (this.board[i][j].fight(this.board[i][j - 1])) {
                    this.toBeCleaned.push(this.board[i][j - 1])
                }
            }
        }
        if (this.board[i + 1][j] != 0 && this.board[i + 1][j] != undefined) {
            if (this.board[i + 1][j].player != this.board[i][j].player) {

                if (this.board[i][j].fight(this.board[i + 1][j])) {
                    this.toBeCleaned.push(this.board[i + 1][j])
                }
            }
        }
        if (this.board[i][j + 1] != 0 && this.board[i][j + 1] != undefined) {
            if (this.board[i][j + 1].player != this.board[i][j].player) {

                if (this.board[i][j].fight(this.board[i][j + 1])) {
                    this.toBeCleaned.push(this.board[i][j + 1])
                }
            }
        }
    }

    checkHighGround(i, j) {
        if (this.terrain[i][j] == 1) {
            this.board[i][j].highGround();
        }
    }

    boardClick(x, y) {
        if (this.peiceClicked == true) {
            return;
        }
        console.log("click on " + x + " " + y)
        var peice = this.board[x][y]
        if (peice != 0 && peice != undefined) {
            if (peice.player == this.currPlayer) {
                this.peiceClicked = true
                this.clickedPiece = this.board[x][y]
                this.genMoves(x, y, peice.moveSpeed)

            }
        }
    }

    genMoves(x, y, speed) {
        if (speed == -1) {
            return;
        }
        if (x >= 0 && x <= 10) {
            if (this.board[x][y] == 0) {
                if (this.clickedPiece.player == 0) {
                    var possible = new BoardHighlight(this, boardOffestX + 60 * x, boardOffsetY - unitOffsetY + 60 * y, "whiteUnitTemp", 0, x, y, true).setInteractive();
                    this.possibleMoves.add(possible)
                } else {
                    var possible = new BoardHighlight(this, boardOffestX + 60 * x, boardOffsetY + unitOffsetY + 60 * y, "blackUnitTemp", 0, x, y, true).setInteractive();
                    this.possibleMoves.add(possible)
                }
            }
        }
        this.genMoves(x + 1, y, speed - 1)
        this.genMoves(x - 1, y, speed - 1)
        this.genMoves(x, y + 1, speed - 1)
        this.genMoves(x, y - 1, speed - 1)

    }

    finalizePlacement(x, y) {
        this.possibleMoves.clear(true, true);
        this.peiceClicked = false
        this.board[x][y] = this.clickedPiece
        this.board[this.clickedPiece.boardX][this.clickedPiece.boardY] = 0
        this.clickedPiece.boardX = x
        this.clickedPiece.boardY = y
        this.clickedPiece.x = boardOffestX + 60 * x
        if (this.clickedPiece.player == 0) {
            this.clickedPiece.y = boardOffsetY - unitOffsetY + 60 * y
        } else {
            this.clickedPiece.y = boardOffsetY + unitOffsetY + 60 * y
        }
        this.movesCurrentTurn -= 1
    }

    drawHandP1() {
        var calvCard = new Card(this, 125, 700, "cardTempWhite", 0, "calv", 0).setInteractive();
        this.applySlideTweenUp(calvCard)
        this.applySlideTweenDown(calvCard)
        this.p1Hand.add(calvCard)
        var infCard = new Card(this, 275, 700, "cardTempWhite", 0, "inf", 0).setInteractive();
        this.applySlideTweenUp(infCard)
        this.applySlideTweenDown(infCard)
        this.p1Hand.add(infCard)
        var infHeavyCard = new Card(this, 425, 700, "cardTempWhite", 0, "infHeavy", 0).setInteractive();
        this.applySlideTweenUp(infHeavyCard)
        this.applySlideTweenDown(infHeavyCard)
        this.p1Hand.add(infHeavyCard)
        var pikeCard = new Card(this, 575, 700, "cardTempWhite", 0, "pike", 0).setInteractive();
        this.applySlideTweenUp(pikeCard)
        this.applySlideTweenDown(pikeCard)
        this.p1Hand.add(pikeCard)
    }
    drawHandP2() {
        var calvCard = new Card(this, 705, 700, "cardTempBlack", 0, "calv", 1).setInteractive();
        this.applySlideTweenUp(calvCard)
        this.applySlideTweenDown(calvCard)
        this.p2Hand.add(calvCard)
        var infCard = new Card(this, 855, 700, "cardTempBlack", 0, "inf", 1).setInteractive();
        this.applySlideTweenUp(infCard)
        this.applySlideTweenDown(infCard)
        this.p2Hand.add(infCard)
        var infHeavyCard = new Card(this, 1005, 700, "cardTempBlack", 0, "infHeavy", 1).setInteractive();
        this.applySlideTweenUp(infHeavyCard)
        this.applySlideTweenDown(infHeavyCard)
        this.p2Hand.add(infHeavyCard)
        var pikeCard = new Card(this, 1155, 700, "cardTempBlack", 0, "pike", 1).setInteractive();
        this.applySlideTweenUp(pikeCard)
        this.applySlideTweenDown(pikeCard)
        this.p2Hand.add(pikeCard)
    }

    applySlideTweenUp(card) {
        card.on('pointerover', () => {
            this.tweens.add({
                targets: card,
                y: 620,
                ease: "power2",
                duration: 300

            });
        });
    }
    applySlideTweenDown(card) {
        card.on('pointerout', () => {
            this.tweens.add({
                targets: card,
                y: 700,
                ease: "power2",
                duration: 300

            });
        });
    }
    playCard(card) {
        if (this.peiceClicked == true || this.currPlayer != card.player) {
            return;
        }
        this.peiceClicked = true
        for (let i = 0; i < 11; i++) {
            if (this.currPlayer == 0) {
                if (this.board[i][8] == 0) {
                    var possible = new BoardHighlight(this, boardOffestX + 60 * i, boardOffsetY - unitOffsetY + 60 * 8, "whiteUnitTemp", 0, i, 8, false, card.name).setInteractive();
                    this.possibleMoves.add(possible)
                }
            } else {
                if (this.board[i][0] == 0) {
                    var possible = new BoardHighlight(this, boardOffestX + 60 * i, boardOffsetY + unitOffsetY + 60 * 0, "blackUnitTemp", 0, i, 0, false, card.name).setInteractive();
                    this.possibleMoves.add(possible)
                }
            }
        }
        card.setActive(false).setVisible(false)

    }

    genPiece(x, y, name) {
        if (this.currPlayer == 0) {
            this.board[x][y] = new Unit(this, boardOffestX + 60 * x, boardOffsetY - unitOffsetY + 60 * y, "whiteUnit", 0, 0, x, y, name).setInteractive()
        } else {
            this.board[x][y] = new Unit(this, boardOffestX + 60 * x, boardOffsetY + unitOffsetY + 60 * y, "blackUnit", 0, 1, x, y, name).setInteractive()
        }
        this.pieces.add(this.board[x][y])
        this.possibleMoves.clear(true, true);
        this.peiceClicked = false;
        this.movesCurrentTurn -= 1;

    }
    doCleanup() {
        for (let i = 0; i < this.toBeCleaned.length; i++) {
            let x = this.toBeCleaned[i].boardX
            let y = this.toBeCleaned[i].boardY
            this.board[x][y] = 0
            this.pieces.remove(this.toBeCleaned[i], true, true);
        }
        this.toBeCleaned = []
    }



}

