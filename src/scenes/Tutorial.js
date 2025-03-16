class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    create() {
        // Title Text
        let tutorialTextConfig  = {
            fontFamily: 'Times New Roman',
            fontSize: '20px',
            backgroundColor: 'rgb(240,181,113)',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 0
        }
        let sectionTitleTextConfig  = {
            fontFamily: 'Times New Roman',
            fontSize: 'bold 35px',
            backgroundColor: 'rgb(240,181,113)',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 0
        }



       

        

        const advanceButton = this.add.text(this.cameras.main.width / 7, 650, 'Next', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            padding: { x: 20, y: 10 },
            backgroundColor: '#333',
        }).setOrigin(0.5).setInteractive();

        const playButton = this.add.text((this.cameras.main.width / 7) * 6, 650, 'Play', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            padding: { x: 20, y: 10 },
            backgroundColor: '#333',
        }).setOrigin(0.5).setInteractive();

        let offset = 25
        let page = 0;

        this.titleText = this.add.text(5, 5, "Towers", sectionTitleTextConfig)
        this.text1 = this.add.text(5, offset * 2, "Welcome to Towers, the military strategy card game adapted from The Stormlight archive by Brandon Sanderson", tutorialTextConfig)
        this.text2 = this.add.text(5, offset * 3, "In towers you will take turn playing units in the form of cards on the board,", tutorialTextConfig)
        this.text3 = this.add.text(5, offset * 4, "Victory will take a combination of careful position, a smart composition of units, and a willingness to retreat when neccessary.", tutorialTextConfig)
        this.text4 = this.add.text(5, offset * 5, "each player can play a total of 5 units on to the board allowing for a variety of army compositions.", tutorialTextConfig)
        this.text5 = this.add.text(5, offset * 6, "Additionally, players may retreat units allowing for composition to change over the course of the game.", tutorialTextConfig)
        this.text6 = this.add.text(5, offset * 7, "The overall goal of the game is to outmaneuver your opponent and destroy their army before they do the same to you.", tutorialTextConfig)
       
        advanceButton.on('pointerdown', () => {
            if (page == 0){
                this.text1.setText("By hovering over units either on the board or as cards you will see their stats displayed along the left of the screen.")
                this.text2.setText("Name is self explanatory, however, Singer troop names will make much more sense if you've read the books")
                this.text3.setText("Attack and defense are also simple, and are the basis of the combat phase which will be explained later")
                this.text4.setText("Range and move speed define how many orthogonal spaces away a unit may attack or move respecivly")
                this.text5.setText("Next is flanking penalty. This is a reduction to defense that a unit applies to diagonally adjacent enemies.")
                this.text6.setText("And support bonus, which is a defense raise that a unit give the orthogonally adjacent allies")
                page += 1
            } else if (page == 1){
                this.text1.setText("Every turn each player makes 3 moves before combat occurs. For their move a player may either deploy a unit, retreat a unit, or move a unit.")
                this.text2.setText("Combat has two phases. First all flanking and support actions occur, then all orthogonally adjacent units fight")
                this.text3.setText("When two units fight they compare their modified stats. If a units attack is higher than their enemies defense then they will destroy the enemy.")
                this.text4.setText("Once combat has resolved the turn will start over with both players making their moves before combat occurs again.");
                this.text5.setText("Combat results are also displayed in the console showing support, flanking, and units defeated")
                this.text6.setText("")
                page += 1
            } else{
                this.text1.setText("Hopefully his tutorial has provided you with all the knowledge that you will need in order to win.")
                this.text2.setText("")
                this.text3.setText("")
                this.text4.setText("")
                this.text5.setText("")
                advanceButton.setVisible(false)
            }
            //this.add.text(3, offset *12, "Every turn each player makes 3 moves before combat occurs. For their move a player may either deploy a unit,", tutorialTextConfig)
            //this.add.text(3, offset *13, "retreat a unit, or move a unit.", tutorialTextConfig)
            //this.add.text(3, offset *14, "When combat occurs there are two phases. First all flanking and support actions occur, then all orthogonally adjacent units fight", tutorialTextConfig)
            //this.add.text(3, offset *15, "When two units fight they compare their modified stats. If a units attack is higher than their enemies defense then they will", tutorialTextConfig)
            //this.add.text(3, offset *16, "destroy the enemy.", tutorialTextConfig)
            //this.add.text(3, offset *17, "Hopefully his tutorial has provided you with all the knowledge that you will need in order to win.", tutorialTextConfig)
            //this.add.text(3, offset *18, "For those of you who fight for Honor, may he live on in your heart, and for those of you who fight for Odium may the rhythms guide your blade", tutorialTextConfig)
        });

        playButton.on('pointerdown', () => {
            this.scene.start('playScene');
        });

    }
}