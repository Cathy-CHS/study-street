import Phaser from 'phaser';
import User from '../entity/User';
import Friend from '../entity/Friend';
import socket from '../../../socket';
import { createCharacterAnimsGirl, createCharacterAnimsWizard } from '../anims/CharacterAnims';
import Study from './StudyScene';
import GroupArea from '../entity/GroupArea';
import Desk from '../entity/Desk';
import Tooltip from '../entity/Tooltip';
import Book from '../entity/Book';
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:4001";
/** 
 * class MapScene
 * @ extends : Phaser.Scene 
 * @ extended by : FirstScene, SecondScene (all the scenes in form of navigatable map)
 * @ Reference
 * Phaser Scene class inheritance : https://youtu.be/1P8jvnj85e4
 * 
 */

export default class MapScene extends Phaser.Scene {
  constructor(key) {
    super(key);
    this.socket = socket;   
    this.key = key;    
    this.world1 = null;
  }

  init(data) {   
    this.prevScene = data == undefined ? undefined : data.prevScene
    console.log("Welcome to ", this.key);  
  }

  preload() {
    this.load.spritesheet('user-girl', 'assets/spriteSheets/user_1.png', {
        frameWidth: 32 * (100/3),
        frameHeight: 42 * (100/3)
    });
    this.load.spritesheet('user-wizard', 'assets/spriteSheets/wizard.png', {
        frameWidth: 60,
        frameHeight: 90
    });
    this.load.spritesheet('booksheet', 'assets/spriteSheets/booksheet.png', {
        frameWidth: 28,
        frameHeight: 35
    });
    this.load.html('newArtifact', 'assets/NewArtifact.html');
    this.load.html('alert', 'assets/NewAlert.html');
  }

  create() {    
    createCharacterAnimsWizard(this.anims);
    createCharacterAnimsGirl(this.anims);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.createUser();
    this.createFriend();
  }

  createUser() {
    this.user = new User(this, 800, 400, 'user-girl', 'girl').setScale(3/100 * 1.2);
    this.user.init();
    this.user.setDepth(1);

    this.updateCamera();

    this.physics.add.collider(this.user, this.spawns);
    this.physics.add.collider(this.user, this.belowPlayer1);
    this.physics.add.collider(this.user, this.world1);

    // this.physics.add.overlap(
    //     this.bufferToFirst,
    //     this.user,
    //     this.handleEnterBuffer,
    //     undefined,
    //     this
    // );
  }

  createFriend(){
      this.friends =this.add.group();
      this.friendDict = {}
      console.log(this.friends)  
  }

    /** createPortal
     * @parameter x, y, deskKey : fspritekey for desk, chairkey : spritekey for chair
     * @return Desk : extends sprite, defined in entity/Desk.js
     */
  createPortal(x, y){       
      this.portal = this.add.circle(x, y, 200, 0xffffff, 0.5);
      this.portalCollider = this.add.circle(x, y, 150);
      this.physics.world.enable(this.portalCollider);
      this.portal.setScale(1, 0.2);
      this.portalCollider.setScale(1, 0.2);
      this.portalCollider.body.setImmovable(true);
      this.physics.add.collider(this.user, this.portalCollider, (() => {
          this.user.disableBody(false);
          let newScene = this.key === 'Library'? 'Rest' : 'Library';
          this.changeScene(newScene, null);
      }));
  }

  updateCamera() {    
    this.cameras.main.startFollow(this.user);
    this.cameras.main.roundPixels = true; // avoid tile bleed
    /**
     * 주석 처리된 경우 카메라가 맵 밖으로까지 이동해서 맵 바깥쪽 어두운 부분이 보입니다.
     * setBounds 를 다음과 같이 하면 카메라가 맵 밖으로 안나가게 가둬둘 수 있습니다. 문제는
     * this.world1.displayHeight가 1228.8 이 나오는데 width 보다도 훨씬 짧아서 맵의 절반까지 밖에 커버가 안됩니다. 왜일까요 ?
     * 
     */
    this.cameras.main.setBounds(0, 0, this.belowPlayer1.displayWidth, this.belowPlayer1.displayHeight);
  }

  onStateUpdate(positionList){
    console.log('update');
    if(this.friends === undefined) {return;}
    Object.keys(positionList).forEach(function(id) {        
        if (id === this.socket.id) {return;}
        console.log('Not returned');
        let position = positionList[id]
        if (Object.keys(this.friendDict).includes(id)){
            console.log(id, this.socket.id);
            this.friendDict[id].updateMovement(position);
        } else {        
            let friend = new Friend(this, position.x, position.y, 'user-wizard', 'wizard', id).setScale(1);
            this.friends.add(friend);
            this.friendDict[id] = friend;
        }    
    }.bind(this))
  }

  setEventHandlers(){
    // Description
    // socket.on('event', eventHandler)
  
    // New user message received
    this.socket.on('stateUpdate', this.onStateUpdate.bind(this));
    this.socket.on("LOOP_POSITION", this.onStateUpdate.bind(this));
  }

  changeScene(newScene, index){
    this.game.events.emit("changeScene", newScene);
    this.cameras.main.fadeOut(1000, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        // this.user.setPosition(this.user.x-this.bufferWidth, this.user.y)
        // this.doUpdate = false
        this.scene.start(newScene, {index : index, prevScene: this.key}) ;
    })  
  }   
    // if (newScene === 'Study'){
    //   this.scene.start(newScene);
    // }
    // else{
    //   this.cameras.main.fadeOut(1000, 0, 0, 0)
    //   this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
    //       // this.user.setPosition(this.user.x-this.bufferWidth, this.user.y)
    //       // this.doUpdate = false
    //       this.scene.start(newScene);
    //   })  
    // }
}
