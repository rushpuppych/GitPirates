/**
 * PlayGameState
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var PlayGameState = function(game, options) {
  var $this = this;
  var _private = {};
  var _game = game;
  var _state = new Kiwi.State('PlayGameState');

  // CodePirate System Variables
  this.options = $.extend({
    map: 'test',
    tilemap: {},
    players: []
  }, options);

  /**
   * Constructor
   */
  this.init = function() {
    setTimeout(function() {
      var objPlayer = new ShipGameObject(_game, _state, {tilemap: $this.options.tilemap});
      $this.addPlayer(objPlayer);
      runDemo(objPlayer, 0);
    }, 1000);
  };

  /**
   * KIWI: preload
   * @description
   * This is the Kiwi GameEngine State Preload Method. This will be called
   * if the State was never loaded bevore. This is the place where all The State
   * assets are loaded.
   *
   * @param void
   * @return void
   */
  _state.preload = function () {
      // Load Map and Sprites
      _state.addJSON('tilemap', 'app/data/maps/' + $this.options.map + '.json');
      _state.addSpriteSheet('tiles', 'app/assets/images/tileset/tiles_sheet.png', 64, 64);

      // Load Ships and Object Sprites
      _state.addSpriteSheet('misc', 'app/assets/images/sprites/ships_miscellaneous_sheet.png', 64, 64);
      _state.addSpriteSheet('smoke', 'app/assets/images/sprites/smoke.png', 128, 128);
      _state.addSpriteSheet('bullet', 'app/assets/images/sprites/bullet.png', 12, 12);
      _state.addSpriteSheet('explosion', 'app/assets/images/sprites/explosion.png', 75, 75);
      _state.addSpriteSheet('ships', 'app/assets/images/sprites/ships.png', 76, 123);

      // Load Sound Effects
      //_state.addAudio('cannon_fire', 'app/assets/sound/cannon.mp3');
  };

  /**
   * KIWI: create
   * @description
   * This is the Kiwi GameEngine State Create Method. This will be called every
   * time the Current state will be called. This is the place where all your
   * Game Objects are generated.
   *
   * @param void
   * @return void
   */
  _state.create = function() {
    // Create TileMap
    var objTileMap = new Kiwi.GameObjects.Tilemap.TileMap(_state, 'tilemap', _state.textures.tiles);
    _state.addChild(objTileMap.layers[0]); // Water
    _state.addChild(objTileMap.layers[1]); // LightWater
    _state.addChild(objTileMap.layers[2]); // Islands
    _state.addChild(objTileMap.layers[3]); // Fortification
    _state.addChild(objTileMap.layers[4]); // Objects
    $this.options.tilemap = objTileMap;
  };

  /**
   * KIWI: update
   * @description
   * This is the Kiwi GameEngine State Update Method. This will be called for
   * Every Frame. This is the Place you can listen to Events and handle the GameEngine
   * Logic.
   *
   * @param void
   * @return void
   */
  _state.update = function() {
    Kiwi.State.prototype.update.call(this);

    // Execute Orders of all Players
    for(var strId in $this.options.players) {
      var objPlayer = $this.options.players[strId].executeOrderOnUpdate();
    }
  };

  /**
   * Add Player to Map
   * @description
   * This is adding a Player Object to the TileMap
   *
   * @param void
   * @return void
   */
  this.addPlayer = function(objPlayer) {
    $this.options.players[objPlayer.getId()] = objPlayer;
  };

  /**
   * getState
   * @description
   * This returns the Kiwi Engine GameState
   *
   * @param void
   * @return Kiwi.State
   */
  $this.getState = function() {
    return _state;
  };

  // Constructor Call
  $this.init();
};




// todelete:
function runDemo(objPlayer, numStep) {
  // Order List
  var orderList = [];
  var orderParameter = [];
  orderList[0] = 'MOVE_FORWARDS';
  orderList[1] = 'MOVE_FORWARDS';
  orderList[2] = 'MOVE_FORWARDS';
  orderList[3] = 'MOVE_FORWARDS';
  orderList[4] = 'MOVE_FORWARDS';
  orderList[5] = 'TURN_LEFT';
  orderList[6] = 'TURN_LEFT';
  orderList[7] = 'MOVE_FORWARDS';
  /*
  orderList[0] = 'SHIP_DAMAGE'; orderParameter[0] = {'dmg': 25};
  orderList[1] = 'TURN_LEFT';
  */
  /*
  orderList[0] = 'MOVE_FORWARDS';
  orderList[1] = 'TURN_LEFT';
  orderList[2] = 'MOVE_FORWARDS';
  orderList[3] = 'LOAD_CANNON';
  orderList[4] = 'LOAD_CANNON';
  orderList[5] = 'LOAD_CANNON';
  orderList[6] = 'FIRE_CANNON'; orderParameter[6] = {'canon': 'left', 'power': 3};
  orderList[7] = 'LOAD_CANNON';
  orderList[8] = 'LOAD_CANNON';
  orderList[9] = 'LOAD_CANNON';
  orderList[10] = 'FIRE_CANNON'; orderParameter[10] = {'canon': 'right', 'power': 3};
  */


  // Execute Next Step
  if(objPlayer.isIdle()) {
    var objParamerer = {}
    if(typeof(orderParameter[numStep]) != 'undefined') {
      objParamerer = orderParameter[numStep];
    }

    objPlayer.setOrder(orderList[numStep], objParamerer);
    numStep++;
    if(typeof(orderList[numStep]) == 'undefined') {
      numStep = 0;
    }
  }

  // Recall
  setTimeout(function() {runDemo(objPlayer, numStep);}, 100);
};
