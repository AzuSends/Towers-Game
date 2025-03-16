class BoardHighlight extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, boardX, boardY, hasParent, name) {
    super(scene, x, y, texture, frame)
    this.boardX = boardX
    this.boardY = boardY
    this.hasParent = hasParent
    this.name = name



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

  //Since BoardHighlights work as a way to show the player where they can move or place a piece we need a way to determine whether a piece is being moved or placed so
  //  we simply tell the piece whether it has a parent or not so we know if we should finalize the movement of the existing piece or generate a new piece on the board.
  handleClick() {
    if (this.hasParent == true) {
      this.scene.finalizePlacement(this.boardX, this.boardY);
    }
    else {
      this.scene.genPiece(this.boardX, this.boardY, this.name)
    }
  }


}