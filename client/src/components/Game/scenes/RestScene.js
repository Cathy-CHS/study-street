import Phaser from 'phaser';
import User from '../entity/User';
import Friend from '../entity/Friend';
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:4001";
import MapScene from './MapScene';

export default class Rest extends MapScene {
    constructor() {
      super('Rest');
    }
    init() {
        super.init()
        this.game.registry.set("scene", false);
        this.bufferWidth = 10
    };

    preload() {
        // map in json format
        this.load.image('restTiles1', 'assets/map/restTiles1.png');
        this.load.image('restTiles2', 'assets/map/restTiles2.png');
        this.load.image('restTiles3', 'assets/map/restTiles3.png');
        this.load.tilemapTiledJSON('restMap', 'assets/map/restMap.json');
    };

    create() {
        this.createMap();    
        super.create();    
        this.setEventHandlers();
        let x = this.world1.displayWidth/2;
        let y = this.world1.displayHeight;
        // x = 1000;
        y = 0;
        super.createPortal(x, y);
    };

    update() {
        this.user.update(this.cursors);
        Object.values(this.friendDict).forEach(friend => {friend.update();});
    };

    /**assignGroupArea
     * @parameter deskId: id of desk to assign, groupId : to be implemented
     * 
     */
    assignGroupArea(deskId){        
        let desk = this.desks[deskId];
        let container = this.add.container(desk.x, desk.y); 
        container.setSize(350, 300);        
        let border = this.add.rectangle(0, 0, container.width, container.height);
        border.setStrokeStyle(this.borderWidth, 0xff0000)        
        border.setDepth(-1);
        container.add(border);
        // container.add(desk)
    };

    changeScene(){
        super.changeScene('Library')
    };

    setEventHandlers(){
        super.setEventHandlers()
        // Description
        // socket.on('event', eventHandler)
        this.game.events.on('toLibraryScene', () => {
            console.log('toLibraryScene')
            this.changeScene()
        })
    };
    /** CreateMap()
     * - Add tilemap
     * - Set boundary
     * - Add buffer to another scene (library scene)
     */
    createMap() {
        // create the map
        this.map = this.make.tilemap({ key: 'restMap' });
        const tileset1 = this.map.addTilesetImage('restTiles1', 'restTiles1');
        const tileset2 = this.map.addTilesetImage('restTiles2', 'restTiles2');
        const tileset3 = this.map.addTilesetImage('restTiles3', 'restTiles3');
        const allTiles = [tileset1, tileset2, tileset3];

        this.belowPlayer1 = this.map.createLayer('Below Player1', allTiles);
        this.belowPlayer2 = this.map.createLayer('Below Player2', allTiles);
        this.belowPlayer3 = this.map.createLayer('Below Player3', allTiles);
        this.world1 = this.map.createLayer('World1', allTiles);
        this.world2 = this.map.createLayer('World2', allTiles);
        this.abovePlayer = this.map.createLayer('Above Player', allTiles);

        this.belowPlayer1.setCollisionByProperty({ collides: true });
        this.world1.setCollisionByProperty({ collides: true });
        this.world2.setCollisionByProperty({ collides: true });
        this.abovePlayer.setDepth(10);

        // don't go out of the map
        this.physics.world.bounds.width = this.map.displayWidth;
        this.physics.world.bounds.height = this.map.displayHeight;

        this.bufferToFirst = this.add.rectangle(this.bufferWidth/2, this.map.displayHeight/2, this.bufferWidth, this.map.displayHeight);
        this.physics.add.existing(this.bufferToFirst)
    };
}

// module.exports = {
//     RestScene
// };