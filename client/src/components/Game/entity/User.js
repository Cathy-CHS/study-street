import Phaser from 'phaser';
import socket from '../../../socket';

export default class User extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.stop = true
    this.socket = socket
    this.setCollideWorldBounds(true);
    this.initialize({name : 'User', group : 1, position : {x : this.x, y : this.y}}, this.scene)
  }

  /** Socket emit methods */

  /** initialize : tell server to create this user */
  initialize(userData) {    
    this.socket.emit('initialize', userData);
  };

  /** sendPosition : tell server to move this user */
  sendPosition(positionData) {
    this.socket.emit('positionUpdate', positionData);
  };

  /** Update methods */
  updateAnimation(state){
    this.play(state, true);    
  }

  updateMovement(cursors) {
    this.stop = true
    let state = ''

    // Stop
    this.setVelocity(0);
    // Move left
    if (cursors.left.isDown) {
      this.setVelocityX(-500);
      state = 'left'
    } 
    // Move right
    else if (cursors.right.isDown) {
      this.setVelocityX(500);
      state = 'right'
    }
    // Move up
    if (cursors.up.isDown) {
      this.setVelocityY(-500);
      if (state === ''){
        state = 'up'
      }      
    }
    // Move down
    else if (cursors.down.isDown) {
      this.setVelocityY(500);
      if (state === ''){
        state = 'down'
      }      
    }

    if (state !== ''){
      this.stop = false
    }
    // this.updateAnimation(state)
  }

  update(cursors) {
    this.updateMovement(cursors);
    let positionData = {x : this.x, y : this.y}
    if (!this.stop){
      this.sendPosition(positionData)
    }
  }
}
