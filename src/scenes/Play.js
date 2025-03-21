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
        this.unitAttacking = false;

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

        //Sound definitions

        this.click = this.sound.add('click', {
            volume: 0.5,
            loop: false
        });
        this.clash = this.sound.add('clash', {
            volume: 0.5,
            loop: false
        });
        this.bgm = this.sound.add('drum-bgm', {
            volume: 0.5,
            loop: true
        });



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
        this.attackText = this.add.text(3, textOffset * 2, "Attack: ", statDisplayConfig)
        this.defenseText = this.add.text(3, textOffset * 3, "Defense: ", statDisplayConfig)
        this.rangeText = this.add.text(3, textOffset * 4, "Range: ", statDisplayConfig)
        this.speedText = this.add.text(3, textOffset * 5, "Move Speed: ", statDisplayConfig)
        this.flankText = this.add.text(3, textOffset * 6, "Flank Penalty: ", statDisplayConfig)
        this.supportText = this.add.text(3, textOffset * 7, "Support Bonus: ", statDisplayConfig)
        this.whiteUnitCapText = this.add.text(1150, 5, this.p1Deployed + "/5", whiteUnitCap)
        this.blackUnitCapText = this.add.text(1050, 5, this.p2Deployed + "/5", blackUnitCap)
        whiteUnitCap.backgroundColor = "";
        this.timerText = this.add.text(1065, 75, 'Time: ' + timer, whiteUnitCap);

        //simple timer tick that decrements and updates our timer text which you can see above on line 144. Looped so that the timer doesn't stop ticking after one loop lol
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true,
        });





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
        this.bgm.play()


    }
    update() {


        //Primary game loop. This is very simple since most of the state is managed by the individual pieces. doCombat and the other funtions it calls are rather wordy but that is 
        //  mostly control flow and checking adjacency etc.  
        //Each player gets 3 moves per turn and the turn is complete when they have made their three moves.
        if (this.movesCurrentTurn == 0) {
            this.tradeTurn();
            this.currPlayer = !this.currPlayer;
            this.movesCurrentTurn = this.movesPerTurn;
            if (this.currPlayer == 0) {
                if (this.turn != 0) { this.clash.play(); }
                this.doCombat();
            }
            this.doCleanup();
            console.log("Turn Passed to Opponent");
            this.turn += 1;
            timer = 60
            this.timerText.setText('Time: ' + timer);

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
            //  unitAttacking flag prevents a unit attacking the same enemy additional times.
            this.unitAttacking = true
            this.genAttacks(child.boardX, child.boardY, child.range, child.boardX, child.boardY)
        }

    }

    //i,j necesacially defines a piece based on how it is called so we just have to check adjacent board spaces for pieces and check if there is an ally there. Then we pass the
    //ally to the respective unit and have them apply support bonuses
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
    //Same as support just with diagonal units and enemies instead of allies 
    flank(i, j) {
        if ((i - 1) >= 0 && (j - 1) >= 0) {
            if (this.board[i - 1][j - 1] != 0 && this.board[i - 1][j - 1] != undefined) {
                if (this.board[i - 1][j - 1].player != this.board[i][j].player) {
                    this.board[i][j].applyFlank(this.board[i - 1][j - 1])
                }
            }
        }
        if ((j + 1) <= 8 && (i - 1) >= 0) {
            if (this.board[i - 1][j + 1] != 0 && this.board[i - 1][j + 1] != undefined) {
                if (this.board[i - 1][j + 1].player != this.board[i][j].player) {
                    this.board[i][j].applyFlank(this.board[i - 1][j + 1])
                }
            }
        }
        if ((i + 1) <= 10 && (j - 1) >= 0) {
            if (this.board[i + 1][j - 1] != 0 && this.board[i + 1][j - 1] != undefined) {
                if (this.board[i + 1][j - 1].player != this.board[i][j].player) {
                    this.board[i][j].applyFlank(this.board[i + 1][j - 1])
                }
            }
        }
        if ((j + 1) <= 8 && (i + 1) <= 10) {
            if (this.board[i + 1][j + 1] != 0 && this.board[i + 1][j + 1] != undefined) {
                if (this.board[i + 1][j + 1].player != this.board[i][j].player) {
                    this.board[i][j].applyFlank(this.board[i + 1][j + 1])
                }
            }
        }

    }

    //Checks terrain map for high ground and lets a unit give itself it's high ground bonus if it's on high ground 
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
                this.click.play();
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

    //Origionally attacks were done simillarly to the support function however when adding the first ranged unit, the archer, I though checking all the possible squares it could attack
    //  with nested if statments would be horribly painful so I instead opted to adapt the movement function to instead work for attacks. This also allows for units of any range too
    //  including defensive units with a range of 0 such as a struture even, and high range units. It also would not be too hard to add a minimum range or even a close range and long
    //  range difference. 
    genAttacks(x, y, range, attackerX, attackerY) {
        let attacker = this.board[attackerX][attackerY]
        if (range == -1) {
            return;
        }
        if (x >= 0 && x <= 10 && this.unitAttacking == true) {
            let defender = this.board[x][y]
            if (defender instanceof Unit && defender.player != attacker.player) {
                if (attacker.fight(defender)) {
                    this.toBeCleaned.push(defender);
                    this.unitAttacking = false;
                }
            }
        }

        this.genAttacks(x + 1, y, range - 1, attackerX, attackerY)
        this.genAttacks(x - 1, y, range - 1, attackerX, attackerY)
        this.genAttacks(x, y + 1, range - 1, attackerX, attackerY)
        this.genAttacks(x, y - 1, range - 1, attackerX, attackerY)

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
        var calvCard = new Card(this, 125, 700, "calvaryCardAlethi", 0, "Calvary", 0).setInteractive();
        this.applySlideTweenUp(calvCard)
        this.applySlideTweenDown(calvCard)
        this.p1Hand.add(calvCard)
        var infCard = new Card(this, 275, 700, "infantryCardAlethi", 0, "Infantry", 0).setInteractive();
        this.applySlideTweenUp(infCard)
        this.applySlideTweenDown(infCard)
        this.p1Hand.add(infCard)
        var infHeavyCard = new Card(this, 425, 700, "heavyInfantryCardAlethi", 0, "Heavy Infantry", 0).setInteractive();
        this.applySlideTweenUp(infHeavyCard)
        this.applySlideTweenDown(infHeavyCard)
        this.p1Hand.add(infHeavyCard)
        var pikeCard = new Card(this, 575, 700, "pikeCardAlethi", 0, "Pike Block", 0).setInteractive();
        this.applySlideTweenUp(pikeCard)
        this.applySlideTweenDown(pikeCard)
        this.p1Hand.add(pikeCard)
        var archerCard = new Card(this, 725, 700, "archerCardAlethi", 0, "Archer", 0).setInteractive();
        this.applySlideTweenUp(archerCard)
        this.applySlideTweenDown(archerCard)
        this.p1Hand.add(archerCard)
    }
    drawHandP2() {
        var calvCard = new Card(this, 705, 700, "calvaryCardSinger", 0, "Calvary", 1).setInteractive();
        this.applySlideTweenUp(calvCard)
        this.applySlideTweenDown(calvCard)
        this.p2Hand.add(calvCard)
        var infCard = new Card(this, 855, 700, "infantryCardSinger", 0, "Infantry", 1).setInteractive();
        this.applySlideTweenUp(infCard)
        this.applySlideTweenDown(infCard)
        this.p2Hand.add(infCard)
        var infHeavyCard = new Card(this, 1005, 700, "heavyInfantryCardSinger", 0, "Heavy Infantry", 1).setInteractive();
        this.applySlideTweenUp(infHeavyCard)
        this.applySlideTweenDown(infHeavyCard)
        this.p2Hand.add(infHeavyCard)
        var pikeCard = new Card(this, 1155, 700, "pikeCardSinger", 0, "Pike Block", 1).setInteractive();
        this.applySlideTweenUp(pikeCard)
        this.applySlideTweenDown(pikeCard)
        this.p2Hand.add(pikeCard)
        var archerCard = new Card(this, 555, 700, "archerCardSinger", 0, "Archer", 1).setInteractive();
        this.applySlideTweenUp(archerCard)
        this.applySlideTweenDown(archerCard)
        this.p2Hand.add(archerCard)

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
            this.click.play();
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
        if ((this.currPlayer == 0 && this.p1Deployed >= 5) || (this.currPlayer == 1 && this.p2Deployed >= 5)) {
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
        console.log(this.toBeCleaned)
        for (let i = 0; i < this.toBeCleaned.length; i++) {
            let x = this.toBeCleaned[i].boardX
            let y = this.toBeCleaned[i].boardY
            this.board[x][y] = 0
            if (this.toBeCleaned[i].player == 0) {
                this.p1UnitsLost += 1
                if (this.p1UnitsLost >= 5) {
                    this.gameOver(0)
                }
            } else {
                this.p2UnitsLost += 1
                if (this.p2UnitsLost >= 5) {
                    this.gameOver(1)
                }
            }
            this.pieces.remove(this.toBeCleaned[i], true, true);

        }


        this.toBeCleaned = []
    }


    //Updates all the stat display text with the stats of the unit the player is hovering.
    displayStats(unit) {
        if (unit.unitName == undefined) {
            var temp = new Unit(this, 0, 0, "whiteUnit", 0, 0, 0, 0, unit.name) //Due to stats being tied to the unit's name in order to get the stats for a card easily we can create a
            this.nameText.setText("Name: " + temp.unitName); //                     temporary version of that unit to pull the stats from then destroy it.
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

    tradeTurn() {
        this.p1Hand.setVisible(this.currPlayer)
        this.p2Hand.setVisible(!this.currPlayer)
    }
    //Nothing fancy here, hides all the pieces and throws some colored text up on screen based on who won.
    gameOver(losingPlayer) {
        let gameOverTextConfig = {
            fontFamily: 'Times New Roman',
            fontSize: 'bold 36px',
            backgroundColor: 'rgb(250,181,133)',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
                left: 0,
            },
            fixedWidth: 0
        }
        if (losingPlayer == 0) {
            this.gameOverText = this.add.text(this.cameras.main.width / 2, (this.cameras.main.height / 3) - 5, "The Singers Win!", gameOverTextConfig).setOrigin(0.5, 0.5)

        } else if (losingPlayer == 1) {
            this.gameOverText = this.add.text(this.cameras.main.width / 2, (this.cameras.main.height / 3) - 5, "The Alethi Win!", gameOverTextConfig).setOrigin(0.5, 0.5)
            this.gameOverText.setBackgroundColor("#76c2be");
            this.gameOverText.setColor("#333333")
        }
        this.pieces.setVisible(false);
        this.p1Hand.setVisible(false);
        this.p2Hand.setVisible(false);
        this.menuButton = this.add.text(this.cameras.main.width / 2, 300, 'Main Menu', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            padding: { x: 20, y: 10 },
            backgroundColor: '#333',
        }).setOrigin(0.5).setInteractive();

        this.menuButton.on('pointerdown', () => {
            this.scene.start('menuScene');
        });
    }
    //timer callback.
    onTimerTick() {
        timer--;
        this.timerText.setText('Time: ' + timer);

        if (timer <= 0) {
            this.movesCurrentTurn = 0;
            timer = 60;
            this.timerText.setText('Time: ' + timer);
        }
    }



}

