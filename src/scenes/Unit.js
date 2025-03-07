class Unit extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, player, boardX, boardY, unitName) {
    super(scene, x, y, texture, frame)
    this.player = player;
    this.boardX = boardX;
    this.boardY = boardY;
    this.attack = 0;
    this.attackBonus = 0;
    this.defense = 0;
    this.defensePenalty = 0;
    this.range = 0;
    this.moveSpeed = 0;
    this.position = 0;
    this.flankBonus = 0;
    this.supportBonus = 0;
    this.highGroundBonus = 0;
    this.unitName = unitName




    // add object to existing scene
    scene.add.existing(this)
  }

  update() {
    //Nothing needed here as this will mostly be used as a class to manage combat and troop position
  }
  ownedBy() {
    return this.player;
  }

  giveSupport(ally) {
    ally.attackBonus += this.supportBonus
    console.log(this.unitName + " applied support to " + ally.unitName)
  }

  applyFlank(enemy) {
    enemy.defensePenalty -= this.flankBonus
    console.log(this.unitName + " is flanking " + enemy.unitName)
  }

  fight(enemy) {
    if ((this.attack + this.attackBonus) >= (enemy.defense - enemy.defensePenalty)) {
      console.log(this.unitName + " destroyed " + enemy.unitName)
    }
  }

  highGround() {
    console.log(this.unitName + " has the high ground ")
  }

}