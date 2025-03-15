class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        // Title Text
        this.add.text(this.cameras.main.width / 2, 100, 'Towers', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Times New Roman',
        }).setOrigin(0.5);

        // Play Button
        const playButton = this.add.text(this.cameras.main.width / 2, 300, 'Play', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            padding: { x: 20, y: 10 },
            backgroundColor: '#333',
        }).setOrigin(0.5).setInteractive();
        
        const tutorialButton = this.add.text(this.cameras.main.width / 2, 400, 'Tutorial', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            padding: { x: 20, y: 10 },
            backgroundColor: '#333',
        }).setOrigin(0.5).setInteractive();

        playButton.on('pointerdown', () => {
            this.scene.start('playScene');
        });

        tutorialButton.on('pointerdown', () => {
            this.scene.start('tutorialScene');
        });


        playButton.on('pointerover', () => {
            playButton.setStyle({ fill: '#ff0' });
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ fill: '#fff' });
        });


        tutorialButton.on('pointerover', () => {
            tutorialButton.setStyle({ fill: '#ff0' });
        });

        tutorialButton.on('pointerout', () => {
            tutorialButton.setStyle({ fill: '#fff' });
        });
    }
}