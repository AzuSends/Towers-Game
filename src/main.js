/*
Ben Silver
Towers: A Stormlight Card Game 
*/
let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: "rgb(240,181,113)",
    scene: [ Play ]
}
let game = new Phaser.Game(config)

const boardOffestX = 339;
const boardOffsetY = 54;
const unitOffsetY = 15;
const adjacencyDefault= [0,1,2,3,4,5,6,7,8];
const adjacencyMinLeft = [0,3,6];
const adjacencyMinRight = [2,5,8];
const adjacencyMinTop = [0,1,2];
const adjacencyMinBottom = [6,7,8];
console.log(adjacencyDefault[99])



