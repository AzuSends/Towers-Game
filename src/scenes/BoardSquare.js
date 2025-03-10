class BoardSquare extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, boardX, boardY) {
    super(scene, x, y, texture, frame)
    this.boardX = boardX
    this.boardY = boardY



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
    this.scene.boardClick(this.boardX, this.boardY);
  }


}