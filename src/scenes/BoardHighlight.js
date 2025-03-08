class BoardHighlight extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, boardX, boardY, hasParent, name) {
    super(scene, x, y, texture, frame)
    this.boardX = boardX
    this.boardY = boardY
    this.hasParent = hasParent
    this.name = ""



    // add object to existing scene
    scene.add.existing(this)

    this.on('pointerup', this.handleClick, this);
  }

  update() {
    //Nothing needed here as this will mostly be used as a class to manage combat and troop position
  }
  ownedBy() {
    return this.player;
  }

  handleClick() {
    if (this.hasParent == true) {
      this.scene.finalizePlacement(this.boardX, this.boardY);
    }
    else {
      this.scene.genPiece(this.boardX, this.boardY, this.name)
    }
  }


}