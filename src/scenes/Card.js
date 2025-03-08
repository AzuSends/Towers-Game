class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, name) {
    super(scene, x, y, texture, frame)

    this.name = name



    // add object to existing scene
    scene.add.existing(this)

    this.on('pointerup', this.handleClick, this);
  }

  update() {
    //Nothing needed here as this will mostly be used as a class to manage combat and troop position
  }

  handleClick() {
    this.scene.playCard(this);
  }


}