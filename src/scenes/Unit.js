class Unit extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, player, boardX, boardY, unitName) {
    super(scene, x, y, texture, frame)
    this.player = player;
    this.boardX = boardX;
    this.boardY = boardY;
    scene.add.existing(this)

    this.on('pointerup', this.handleClick, this);
    this.unitName = unitName
    //When the unit is created we give it stats based on the card name it was created from.
    //This let's us avoid passing stats from the card to the unit.
    //Also this array method of determining stats in incredibly modular and very simple compared to some sort of nasty set of if statments 
    switch (this.unitName) {
      case "Calvary":
        this.stats = [3, 0, 1, 0, 1, 2, 2, 1, 0]
        break;
      case "Infantry":
        this.stats = [2, 0, 2, 0, 1, 2, 1, 2, 0]
        break;
      case "Heavy Infantry":
        this.stats = [5, 0, 2, 0, 1, 1, 3, 2, 0]
        break;
      case "Pike Block":
        this.stats = [2, 0, 4, 0, 1, 1, 2, 3, 0]
        break;
      case "Archer":
        this.stats = [2, 0, 1, 0, 2, 1, 0, 0, 1]
        break;
      default:
        console.log("Invalid unit name: " + this.unitName)
        break;
    }
    this.attack = this.stats[0];
    this.attackBonus = this.stats[1];
    this.defense = this.stats[2];
    this.defensePenalty = this.stats[3];
    this.range = this.stats[4];
    this.moveSpeed = this.stats[5];
    this.flankBonus = this.stats[6];
    this.supportBonus = this.stats[7];
    this.highGroundBonus = this.stats[8];
  }








  update() {
    //Nothing needed here as this will mostly be used as a class to manage combat and troop position
  }
  ownedBy() {
    return this.player;
  }
  //Makes sure stat changed don't carry over between turns
  resetBonuses() {
    this.attackBonus = 0;
    this.defensePenalty = 0;

  }
  //Stat changes and combat are handled here since it cleans up the code and also allows for simple changes or expansion on supporting, flanking, and fighting for differenent units. 
  giveSupport(ally) {
    ally.defensePenalty += this.supportBonus
    if (this.player == 0) {
      console.log("Alethi " + this.unitName + " applied support to ally " + ally.unitName)
    }
    if (this.player == 1) {
      console.log("Singer " + this.unitName + " applied support to ally " + ally.unitName)
    }

  }

  applyFlank(enemy) {
    enemy.defensePenalty -= this.flankBonus
    if (this.player == 0) {
      console.log("Alethi " + this.unitName + " is flanking enemy " + enemy.unitName)
    }
    if (this.player == 1) {
      console.log("Singer " + this.unitName + " is flanking enemy " + enemy.unitName)
    }
  }

  fight(enemy) {
    if ((this.attack + this.attackBonus) >= (enemy.defense + enemy.defensePenalty)) {
      if (this.player == 0) {
        console.log("Alethi " + this.unitName + " defeated an enemy " + enemy.unitName)
      }
      if (this.player == 1) {
        console.log("Singer " + this.unitName + " defeated an enemy " + enemy.unitName)
      }
      return true;
    } else {
      return false;
    }
  }

  highGround() {
    console.log(this.unitName + " has the high ground (NYI)")
  }

  handleClick() {
    this.scene.boardClick(this.boardX, this.boardY);
  }


}