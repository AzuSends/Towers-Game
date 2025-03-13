/*
Ben Silver
Towers: A Stormlight Card Game 
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




