class Unit extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame)
      this.player = 0;
      this.attack = 0;
      this.defense = 0;
      this.range = 0;
      this.moveSpeed = 0;
      this.row = 0;
      this.column = 0;
      this.flankBonus = 0;
      this.supportBonus = 0;
      


  
      // add object to existing scene
      scene.add.existing(this)
    }

    update(){
        //Nothing needed here as this will mostly be used as a class to manage combat and troop position
    }
    ownedBy(){
      return this.player;
    }
    
    
  }