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
    players: []
  }, options);

  /**
   * Constructor
   */
  this.init = function() {
    setTimeout(function() {
      var objPlayer = new ShipGameObject(_game, _state);
      $this.addPlayer(objPlayer);
      runDemo(objPlayer, 0);
    }, 1000);

    setTimeout(function() {
      var objPlayer = new ShipGameObject(_game, _state);
      $this.addPlayer(objPlayer);
      runDemo(objPlayer, 0);
    }, 5000);    
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
      _state.addSpriteSheet('ship_01', 'app/assets/images/sprites/ship_01.png', 70, 118);
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
    _state.addChild(objPlayer.getGameOject());
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
  orderList[0] = 'MOVE_FORWARDS';
  orderList[1] = 'MOVE_FORWARDS';
  orderList[2] = 'TURN_LEFT';
  orderList[3] = 'MOVE_FORWARDS';
  orderList[4] = 'MOVE_FORWARDS';
  orderList[5] = 'TURN_LEFT';
  orderList[6] = 'MOVE_FORWARDS';
  orderList[7] = 'MOVE_FORWARDS';
  orderList[8] = 'MOVE_FORWARDS';
  orderList[9] = 'TURN_LEFT';
  orderList[10] = 'MOVE_FORWARDS';
  orderList[11] = 'MOVE_FORWARDS';
  orderList[12] = 'TURN_LEFT';
  orderList[13] = 'MOVE_FORWARDS';
  orderList[14] = 'MOVE_FORWARDS';
  orderList[15] = 'MOVE_FORWARDS';
  orderList[16] = 'TURN_LEFT';
  orderList[17] = 'MOVE_FORWARDS';
  orderList[18] = 'MOVE_FORWARDS';
  orderList[19] = 'TURN_LEFT';
  orderList[20] = 'MOVE_FORWARDS';
  orderList[21] = 'MOVE_FORWARDS';
  orderList[22] = 'MOVE_FORWARDS';
  orderList[23] = 'TURN_LEFT';
  orderList[24] = 'MOVE_FORWARDS';
  orderList[25] = 'MOVE_FORWARDS';
  orderList[26] = 'TURN_LEFT';
  orderList[27] = 'MOVE_FORWARDS';

  orderList[28] = 'TURN_RIGHT';
  orderList[29] = 'TURN_RIGHT';
  orderList[30] = 'TURN_RIGHT';
  orderList[31] = 'TURN_RIGHT';

  orderList[32] = 'MOVE_FORWARDS';
  orderList[33] = 'TURN_RIGHT';
  orderList[34] = 'MOVE_FORWARDS';
  orderList[35] = 'MOVE_FORWARDS';
  orderList[36] = 'TURN_RIGHT';
  orderList[37] = 'MOVE_FORWARDS';
  orderList[38] = 'MOVE_FORWARDS';
  orderList[39] = 'MOVE_FORWARDS';
  orderList[40] = 'TURN_RIGHT';
  orderList[41] = 'MOVE_FORWARDS';
  orderList[42] = 'MOVE_FORWARDS';
  orderList[43] = 'TURN_RIGHT';
  orderList[44] = 'MOVE_FORWARDS';
  orderList[45] = 'MOVE_FORWARDS';
  orderList[46] = 'MOVE_FORWARDS';
  orderList[47] = 'TURN_RIGHT';
  orderList[48] = 'MOVE_FORWARDS';
  orderList[49] = 'MOVE_FORWARDS';
  orderList[50] = 'TURN_RIGHT';
  orderList[51] = 'MOVE_FORWARDS';
  orderList[52] = 'MOVE_FORWARDS';
  orderList[53] = 'MOVE_FORWARDS';
  orderList[54] = 'TURN_RIGHT';
  orderList[55] = 'MOVE_FORWARDS';
  orderList[56] = 'MOVE_FORWARDS';
  orderList[57] = 'TURN_RIGHT';
  orderList[58] = 'MOVE_FORWARDS';
  orderList[59] = 'MOVE_FORWARDS';

  orderList[60] = 'TURN_LEFT';
  orderList[61] = 'TURN_LEFT';
  orderList[62] = 'TURN_LEFT';
  orderList[63] = 'TURN_LEFT';

  // Execute Next Step
  if(objPlayer.isIdle()) {
    //console.log(numStep);
    objPlayer.setOrder(orderList[numStep]);
    numStep++;
    if(typeof(orderList[numStep]) == 'undefined') {
      numStep = 0;
    }
  }

  // Recall
  setTimeout(function() {runDemo(objPlayer, numStep);}, 100);
};
