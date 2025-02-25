/*
Ben Silver
Rocket Patrol MMXXXIV: Please Let Me Out Of The Publishers Basement
4-ish Hours, Most of the time was spent on the two player mode
Mods:
New Spaceship (5) //In addition to the other requirements for this task I also gave this ship the new behavior of going back and forth instead of just right to left 
Added control after fired (1)
Two Player Mode (5)
High Score Tracking (1) //Works with scores in two player mode 
System for adding time on hit and removing time on miss (5) //Adds 1 second on hit and removes 3 seconds on a miss
Added Timer (3)
No citations needed
*/
let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: [ Play ]
}
let game = new Phaser.Game(config)



