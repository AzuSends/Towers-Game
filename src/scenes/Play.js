class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        //Setup state managment variables
        this.board = [];
        this.terrain = [];
        this.objectBoard = []
        this.toBeCleaned = []
        this.clickedPiece = 0
        this.turn = 0;
        this.movesPerTurn = 3;
        this.movesCurrentTurn = 0;
        this.currPlayer = 1;
        this.peiceClicked = false
        this.p1Deployed = 0;
        this.p2Deployed = 0;
        this.p1UnitsLost = 0;
        this.p2UnitsLost = 0;

        //Graphics Controller
        this.graphics = this.add.graphics();
        
        //Groups for managing class instances
        this.pieces = this.add.group();
        this.p1Hand = this.add.group();
        this.p2Hand = this.add.group();
        this.possibleMoves = this.add.group();


        //Generating generic textures for pieces and cards (Ideally card will get art but units will likely remain simple) 
        this.graphics.fillStyle(0x40c72c, 1);
        this.graphics.fillRect(0, 0, 57, 57);
        this.graphics.generateTexture("squareTextureGreen", 57, 57)

        this.graphics.fillStyle(0x71acf0, 1);
        this.graphics.fillRect(0, 0, 57, 57); 
        this.graphics.generateTexture("squareTexture", 57, 57)

        this.graphics.fillStyle(0x000000, 1); 
        this.graphics.fillRect(0, 0, 57, 26.5); //310 + 60i, 55+60j (reference)
        this.graphics.generateTexture("blackUnit", 57, 26.5)
        this.graphics.clear();

        this.graphics.fillStyle(0x000000, 0.3); 
        this.graphics.fillRect(0, 0, 57, 26.5); //310 + 60i, 55+60j
        this.graphics.generateTexture("blackUnitTemp", 57, 26.5)

        this.graphics.fillStyle(0xffffff, 1); 
        this.graphics.fillRect(0, 0, 57, 26.5); //310 + 60i, 25+60j
        this.graphics.generateTexture("whiteUnit", 57, 26.5)
        this.graphics.clear();

        this.graphics.fillStyle(0xffffff, 0.3); 
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



        //Simple setup for piece stat display
        let statDisplayConfig = {
            fontFamily: 'Times New Roman',
            fontSize: '28px',
            backgroundColor: 'rgb(240,181,113)',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 0
        }
        let blackUnitCap = {
            fontFamily: 'Times New Roman',
            fontSize: '30px',
            backgroundColor: '#ffffff',
            color: '#000000',
            align: 'center',
            padding: {
                top: 4,
                bottom: 4,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }
        let whiteUnitCap = {
            fontFamily: 'Times New Roman',
            fontSize: '30px',
            backgroundColor: '#000000',
            color: '#ffffff',
            align: 'center',
            padding: {
                top: 4,
                bottom: 4,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }


        //Definitions so that text can be easily updted
        let textOffset = 35
        this.nameText = this.add.text(3, textOffset, "Name: ", statDisplayConfig)
        this.attackText = this.add.text(3, textOffset*2, "Attack: ", statDisplayConfig)
        this.defenseText = this.add.text(3, textOffset*3, "Defense: ", statDisplayConfig)
        this.rangeText = this.add.text(3, textOffset*4, "Range: ", statDisplayConfig)
        this.speedText = this.add.text(3, textOffset*5, "Move Speed: ", statDisplayConfig)
        this.flankText = this.add.text(3, textOffset*6, "Flank Penalty: ", statDisplayConfig)
        this.supportText = this.add.text(3, textOffset*7, "Support Bonus: ", statDisplayConfig)
        this.whiteUnitCapText = this.add.text(1150, 5, this.p1Deployed + "/5", whiteUnitCap)
        this.blackUnitCapText = this.add.text(1050, 5, this.p2Deployed + "/5", blackUnitCap)
        




        //There are three pieces here
        //The objectBoard is a set of objects that create the visual representation, this allows clicks to be registered onto board squares easily but is not currently used
        //Board is initiallized to 0's and will store the piece instances in it, this allows for quickly determining adjacency to other pieces without having to iterate over all of them.
        //  We can instead just check the respective board space for an object
        //Finally is terrain, we just set 2 2x2 squares as high group by coloring the squares green and setting that part of the high groud matrix to 1 for quick checking.
        //  Eventually high group will give bounus stats to units and extra range to ranged units   
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
        //Draws card into each players hand, check function for more info. 
        this.drawHandP1()
        this.drawHandP2()


    }
    update() {

        //Primary game loop. This is very simple since most of the state is managed by the individual pieces. doCombat and the other funtions it calls are rather wordy but that is 
        //  mostly control flow and checking adjacency etc.  
        //Each player gets 3 moves per turn and the turn is complete when they have made their three moves.
        if (this.movesCurrentTurn == 0) {
            this.tradeTurn();
            this.currPlayer = !this.currPlayer;
            this.movesCurrentTurn = this.movesPerTurn;
            if(this.currPlayer == 0){
                this.doCombat();
            }
            this.doCleanup();
            console.log("Turn Passed to Opponent");
            this.turn += 1;
            
        }



    }



    doCombat() { //Check respective function to see implementation

        for (const child of this.pieces.getChildren()) { //Seperate loop to clear all stat changes from previous combat
            child.resetBonuses();
        }
        for (const child of this.pieces.getChildren()) {
            //Apply support bonus to orthogonally adjacent allies
            this.support(child.boardX, child.boardY)
            //Apply flanking penalty to diagonally adjacent enemies
            this.flank(child.boardX, child.boardY)
            //Each piece checks if it is on high group and applies the respective bonuses
            this.checkHighGround(child.boardX, child.boardY)
            
        }
        for (const child of this.pieces.getChildren()) { //Seperate loop to allow all stat changes to be preformed first
            //Compares combat stats of orthogonally adjacent enemies after bonuses and penalties, units are destroyed if the attacking unit's attack is greater than their defense
            this.attack(child.boardX, child.boardY)
        }

    }

    support(i, j) {
        if (i - 1 >= 0) {
            if (this.board[i - 1][j] != 0 && this.board[i - 1][j] != undefined) {
                if (this.board[i - 1][j].player == this.board[i][j].player) {
                    this.board[i][j].giveSupport(this.board[i - 1][j])
                }
            }
        }
        if (j - 1 >= 0) {
            if (this.board[i][j - 1] != 0 && this.board[i][j - 1] != undefined) {
                if (this.board[i][j - 1].player == this.board[i][j].player) {
                    this.board[i][j].giveSupport(this.board[i][j - 1])
                }
            }
        }
        if (i + 1 < 11) {
            if (this.board[i + 1][j] != 0 && this.board[i + 1][j] != undefined) {
                if (this.board[i + 1][j].player == this.board[i][j].player) {
                    this.board[i][j].giveSupport(this.board[i + 1][j])
                }
            }
        }
        if (j + 1 < 9) {
            if (this.board[i][j + 1] != 0 && this.board[i][j + 1] != undefined) {
                if (this.board[i][j + 1].player == this.board[i][j].player) {
                    this.board[i][j].giveSupport(this.board[i][j + 1])
                }
            }
        }
    }

    flank(i, j) {
        if((i-1) >= 0 && (j-1) >= 0){
            if (this.board[i - 1][j - 1] != 0 && this.board[i - 1][j - 1] != undefined) {
                if (this.board[i - 1][j - 1].player != this.board[i][j].player) {
                    this.board[i][j].applyFlank(this.board[i - 1][j - 1])
                }
            }
        }
        if((j+1) <= 8 && (i-1) >= 0){        
            if (this.board[i - 1][j + 1] != 0 && this.board[i - 1][j + 1] != undefined) {
                if (this.board[i - 1][j + 1].player != this.board[i][j].player) {
                    this.board[i][j].applyFlank(this.board[i - 1][j + 1])
                }
            }
        }
        if((i+1) <= 10 && (j-1) >= 0){        
            if (this.board[i + 1][j - 1] != 0 && this.board[i + 1][j - 1] != undefined) {
                if (this.board[i + 1][j - 1].player != this.board[i][j].player) {
                    this.board[i][j].applyFlank(this.board[i + 1][j - 1])
                }
            }
        }
        if((j+1)<= 8 && (i+1) <= 10){
            if (this.board[i + 1][j + 1] != 0 && this.board[i + 1][j + 1] != undefined) {
                if (this.board[i + 1][j + 1].player != this.board[i][j].player) {
                    this.board[i][j].applyFlank(this.board[i + 1][j + 1])
                }
            }
        }

    }

    attack(i, j) {

        if((i-1) >= 0){
            if (this.board[i - 1][j] != 0 && this.board[i - 1][j] != undefined) {
                if (this.board[i - 1][j].player != this.board[i][j].player) {
                    if (this.board[i][j].fight(this.board[i - 1][j])) {
                        this.toBeCleaned.push(this.board[i - 1][j])
                    }
                }
            }
        }
        if((j-1) >= 0){
            if (this.board[i][j - 1] != 0 && this.board[i][j - 1] != undefined) {
                if (this.board[i][j - 1].player != this.board[i][j].player) {
                    if (this.board[i][j].fight(this.board[i][j - 1])) {
                        this.toBeCleaned.push(this.board[i][j - 1])
                    }
                }
            }
        }
        if((i+1) <= 10){
            if (this.board[i + 1][j] != 0 && this.board[i + 1][j] != undefined) {
                if (this.board[i + 1][j].player != this.board[i][j].player) {

                    if (this.board[i][j].fight(this.board[i + 1][j])) {
                        this.toBeCleaned.push(this.board[i + 1][j])
                    }
                }
            }
        }
        if((j+1)<= 8){   
            if (this.board[i][j + 1] != 0 && this.board[i][j + 1] != undefined) {
                if (this.board[i][j + 1].player != this.board[i][j].player) {

                    if (this.board[i][j].fight(this.board[i][j + 1])) {
                        this.toBeCleaned.push(this.board[i][j + 1])
                    }
                }
            }
        }
    }

    checkHighGround(i, j) {
        if (this.terrain[i][j] == 1) {
            this.board[i][j].highGround();
        }
    }

    //First checked if a piece is already clicked, if not we set the piece as the clicked peice and show the current player their possible moves 
    boardClick(x, y) {
        if (this.peiceClicked == true) {
            return;
        }
        var peice = this.board[x][y]
        if (peice != 0 && peice != undefined) {
            if (peice.player == this.currPlayer) {
                this.peiceClicked = true
                this.clickedPiece = this.board[x][y]
                this.displayStats(this.clickedPiece)
                this.genMoves(x, y, peice.moveSpeed)

            }
        }
    }

    //I always love when I can find a cool recursive solution to a problem, this function recursivly checks all orthogonally adjacent moves from some square and generates a temporary piece object
    //  which, when clicked, deletes all the temps and moves the origional piece 
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

    //Cleanup for temp pieces 
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

    //Creates all the cards, only the piece name is required since stats are all managed in the unit class when the card becomes a unit and only depends on the piece name.
    //  A tween is given to each card causing them to slide up and down on mouse over.  
    drawHandP1() {
        var calvCard = new Card(this, 125, 700, "cardTempWhite", 0, "Cavilry", 0).setInteractive();
        this.applySlideTweenUp(calvCard)
        this.applySlideTweenDown(calvCard)
        this.p1Hand.add(calvCard)
        var infCard = new Card(this, 275, 700, "cardTempWhite", 0, "Infantry", 0).setInteractive();
        this.applySlideTweenUp(infCard)
        this.applySlideTweenDown(infCard)
        this.p1Hand.add(infCard)
        var infHeavyCard = new Card(this, 425, 700, "cardTempWhite", 0, "Heavy Infantry", 0).setInteractive();
        this.applySlideTweenUp(infHeavyCard)
        this.applySlideTweenDown(infHeavyCard)
        this.p1Hand.add(infHeavyCard)
        var pikeCard = new Card(this, 575, 700, "cardTempWhite", 0, "Pike Block", 0).setInteractive();
        this.applySlideTweenUp(pikeCard)
        this.applySlideTweenDown(pikeCard)
        this.p1Hand.add(pikeCard)
    }
    drawHandP2() {
        var calvCard = new Card(this, 705, 700, "cardTempBlack", 0, "Cavilry", 1).setInteractive();
        this.applySlideTweenUp(calvCard)
        this.applySlideTweenDown(calvCard)
        this.p2Hand.add(calvCard)
        var infCard = new Card(this, 855, 700, "cardTempBlack", 0, "Infantry", 1).setInteractive();
        this.applySlideTweenUp(infCard)
        this.applySlideTweenDown(infCard)
        this.p2Hand.add(infCard)
        var infHeavyCard = new Card(this, 1005, 700, "cardTempBlack", 0, "Heavy Infantry", 1).setInteractive();
        this.applySlideTweenUp(infHeavyCard)
        this.applySlideTweenDown(infHeavyCard)
        this.p2Hand.add(infHeavyCard)
        var pikeCard = new Card(this, 1155, 700, "cardTempBlack", 0, "Pike Block", 1).setInteractive();
        this.applySlideTweenUp(pikeCard)
        this.applySlideTweenDown(pikeCard)
        this.p2Hand.add(pikeCard)
    }

    //Card tween logic, also caused the stat display since both or caused by mouse over
    applySlideTweenUp(card) {
        card.on('pointerover', () => {
            this.displayStats(card)
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
    //Applies a mouse over to indivudial units allowing for stat display on hover
    applyTextUpdate(unit) {
        unit.on('pointerover', () => {
            this.displayStats(unit);
        });
    }
    
    //Callback from the card class, shows valid placements for the card unit, BoardHighlights work the same way they do in genMoves, showing possible moves and self destructing when
    //  placement is complete
    //Additionally there is a boolean variable that lets the BoardHighlight know if the respective move has a parent and therefore whether is sould create a new piece when clicked or
    //  move it's parent piece.
    playCard(card) {
        if (this.peiceClicked == true || this.currPlayer != card.player) {
            return;
        }
        if((this.currPlayer == 0 && this.p1Deployed >= 5) || (this.currPlayer == 1 && this.p2Deployed >= 5)){
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
        //Simple card cleanup
        card.setActive(false).setVisible(false)

    }
    //Case for new piece generation, it will inherit the name from the BoardHighlight which it has in turn inherited from a card. If you look in the unit class all stats are determined
    //  by this unit and stored as arrays allowing for very easy modification to unit stats and addition of new units.
    //The piece is added not just to the board but also to the piece array for easy combat resolution by iterating over each unit and preforming all their respective combat actions.
    genPiece(x, y, name) {
        if (this.currPlayer == 0) {
            this.board[x][y] = new Unit(this, boardOffestX + 60 * x, boardOffsetY - unitOffsetY + 60 * y, "whiteUnit", 0, 0, x, y, name).setInteractive()
            this.applyTextUpdate(this.board[x][y])
            this.p1Deployed += 1;
        } else {
            this.board[x][y] = new Unit(this, boardOffestX + 60 * x, boardOffsetY + unitOffsetY + 60 * y, "blackUnit", 0, 1, x, y, name).setInteractive()
            this.applyTextUpdate(this.board[x][y])
            this.p2Deployed += 1;
        }
        this.pieces.add(this.board[x][y])
        this.possibleMoves.clear(true, true);
        this.peiceClicked = false;
        this.movesCurrentTurn -= 1;
        this.blackUnitCapText.setText(this.p1Deployed + "/5")
        this.whiteUnitCapText.setText(this.p2Deployed + "/5")


    }

    //Simple cleanup, when preforming combat pieces are not immediately destroyed since they still have to resolve their attacks so they are instead added to the toBeCleaned array and
    //  deleted at the end of the turn.
    doCleanup() {
        for (let i = 0; i < this.toBeCleaned.length; i++) {
            let x = this.toBeCleaned[i].boardX
            let y = this.toBeCleaned[i].boardY
            this.board[x][y] = 0
            if (this.toBeCleaned[i].player == 0){
                this.p1UnitsLost += 1
                if(p1UnitsLost >= 5){
                    gameOver(0)
                }
            }  else {
                this.p2UnitsLost += 1
                if(this.p2UnitsLost >= 5){
                    gameOver(1)
                }
            }

            this.pieces.remove(this.toBeCleaned[i], true, true);
        }
        this.toBeCleaned = []
    }
    
    
    //Updates all the stat display text with the stats of the unit the player is hovering.
    displayStats(unit) {
        if (unit.unitName == undefined) {
            var temp = new Unit(this, 0, 0, "whiteUnit", 0, 0, 0, 0, unit.name)
            this.nameText.setText("Name: " + temp.unitName);
            this.attackText.setText("Attack: " + temp.attack);
            this.defenseText.setText("Defense: " + temp.defense);
            this.rangeText.setText("Range: " + temp.range);
            this.speedText.setText("Move Speed: " + temp.moveSpeed);
            this.flankText.setText("Flank Penalty: " + temp.flankBonus);
            this.supportText.setText("Support Bonus: " + temp.supportBonus);
            temp.destroy()

            return;
        }
        this.nameText.setText("Name: " + unit.unitName)
        this.attackText.setText("Attack: " + unit.attack)
        this.defenseText.setText("Defense: " + unit.defense)
        this.rangeText.setText("Range: " + unit.range)
        this.speedText.setText("Move Speed: " + unit.moveSpeed)
        this.flankText.setText("Flank Penalty: " + unit.flankBonus)
        this.supportText.setText("Support Bonus: " + unit.supportBonus)

    }


    tradeTurn(){
        this.p1Hand.setVisible(this.currPlayer)
        this.p2Hand.setVisible(!this.currPlayer)
    }
    


}

