import Phaser from 'phaser';

export default class Chair extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, id = 0) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.id = id
    console.log('New Chair:', x, y)
  }

  init(){
    this.scene.input.on('pointerdown', function(){
      this.handleChairClicked();
      // this.scene.start('Rest');
      // this.scene.launch('Rest')
      // console.log("FirstScene -> LoadScene. Input : pointerdown")
      // this.scene.resucme('LoadScene');  
      // console.log("LoadScene resumed")
      // this.scene.stop('FirstScene');
   }, this);
  }

  handleChairClicked(){
    
  }



}