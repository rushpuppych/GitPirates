/**
 * PlayGameState
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var PlayGameState = function(game, app, options) {
  var $this = this;
  var _app = app;
  var _private = {};
  var _game = game;
  var _state = new Kiwi.State('PlayGameState');

  // CodePirate System Variables
  this.options = $.extend({
    map: 'test',
    ship: {},
    tilemap: {},
    players: [],
    ship_config: '',
    mission: {},
    game_loop: {
      step: 'write_output',
      init: {},
      orders: [],
      turn: 1,
      blockNextStep: false
    },
  }, options);

  /**
   * Constructor
   */
  this.init = function() {
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
      _state.addAudio('cannon_fire', 'app/assets/sfx/cannon.mp3');
      _state.addAudio('ship_damage', 'app/assets/sfx/explosion.mp3');
      _state.addAudio('ship_move', 'app/assets/sfx/move.mp3');
      _state.addAudio('ship_kill', 'app/assets/sfx/killing.mp3');

      // Load Music
      _state.addAudio('battle_theme', 'app/assets/music/battle.mp3');
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
    // Load Ship Configuration
    $this.getShipConfig();

    // Start InitGame
    $this.initGameLoop();

    // Create External GUI Components
    $('#Border').css('background-image', 'url("app/assets/images/gui/border_ingame.png")');
    $this.createTerminal();
    $('#Minimap').html('<img src="app/data/maps/Pirates_map.png" style="position: absolute; left: 20px; top: 6px;">');
    $('.ingame').show();

    // Create TileMap
    var objTileMap = new Kiwi.GameObjects.Tilemap.TileMap(_state, 'tilemap', _state.textures.tiles);
    _state.addChild(objTileMap.layers[0]); // Water
    _state.addChild(objTileMap.layers[1]); // LightWater
    _state.addChild(objTileMap.layers[2]); // Islands
    _state.addChild(objTileMap.layers[3]); // Fortification
    _state.addChild(objTileMap.layers[4]); // Objects
    $this.options.tilemap = objTileMap;

    // Create Background music
    var objBattleThemeMusic = new Kiwi.Sound.Audio(_game, 'battle_theme', 0.3, true);
    objBattleThemeMusic.play();
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
   * addPlayer
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
   * getPlayer
   * @description
   * This is adding a Player Object to the TileMap
   *
   * @param strId         Player UUID
   * @return objPlayer    Player Object
   */
  this.getPlayer = function(strId) {
    return $this.options.players[strId];
  };

  /**
   * createTerminal
   * @description
   * This is creating the Jquery Terminal Window
   *
   * @param void
   * @return void
   */
  this.createTerminal = function() {
    var objTerminalTools = function(command, term) {

    };
    $('#JTerminal').terminal(objTerminalTools, {
        greetings: 'GitPirates: 1.0 - Terminal',
        onBlur: function() {
            return false;
        }
    });
  };

  /**
   * getShipConfig
   * @description
   * This returns the Ship config or generates a new ship config
   *
   * @param void
   * @return void
   */
  this.getShipConfig = function() {
    // Return Ship Config
    if(typeof($this.options.ship).length > 0) {
      return $this.options.ship;
    }

    // Generate Ship Config
    const objFs = require('fs-jetpack');
    $this.options.ship = JSON.parse(objFs.read($this.options.ship_config));
    var objMission = $this.options.mission;
    $this.options.ship.pos_x = objMission.start_x;
    $this.options.ship.pos_y = objMission.start_y;
  };

  /**
   * setShipConfig
   * @description
   * This is a setter for the ShipConfig File Path
   *
   * @param void
   * @return void
   */
  this.setShipConfig = function(strShipConfig) {
    $this.options.ship_config = strShipConfig;
  };

  /**
   * setMission
   * @description
   * This is a setter for the Mission Object
   *
   * @param void
   * @return void
   */
  this.setMission = function(objMission) {
    $this.options.mission = objMission;
  };

  /**
   * getCodingJson
   * @description
   * This returns the Json File for the External Scripting Engine.
   *
   * @param void
   * @return strJson    Json String For the File Output
   */
  this.getCodingJson = function() {
    var objGeneralJson = $this.getGeneralJson();
    var objPlayerJson = $this.getPlayerJson();
    var objPlayersJson = $this.getPlayersJson();
    var objMapJson = $this.getMapJson();

    var objCoding = {
      general: objGeneralJson,
      player: objPlayerJson,
      players: objPlayersJson,
      map: objMapJson
    };
    return objCoding;
  };

  /**
   * getGeneralJson
   * @description
   * This is rendering the General Json for the External Scripting Engine
   *
   * @param void
   * @return strJson    Json String For the File Output
   */
  this.getGeneralJson = function() {
    var objGeneralJson = {
      turn: $this.options.game_loop.turn
    }
    return objGeneralJson;
  };

  /**
   * getPlayerJson
   * @description
   * This is the Player Json Object
   *
   * @param void
   * @return strJson    Json String For the File Output
   */
  $this.getPlayerJson = function() {
      return $this.options.ship;
  };

  /**
   * getPlayerJson
   * @description
   * This is the Player Json with the player informations
   *
   * @param void
   * @return strJson    Json String For the File Output
   */
  $this.getPlayersJson = function() {
    var objPlayers = [];
    var strPlayerId = $this.options.ship.id;
    for(var strId in $this.options.players) {
      // Create New Player Config Object
      var objPlayer = $this.options.players[strId];
      var objPlayerObject = {
        id: strId,
        name: objPlayer['options']['player_name'],
        color: objPlayer['options']['player_color'],
        health: objPlayer['options']['health'],
        loads: objPlayer['options']['cannon_loads'],
        direction: objPlayer['options']['direction'],
        pos_x: objPlayer['options']['position']['tile_x'],
        pos_y: objPlayer['options']['position']['tile_y']
      };

      // Add Players if not Main Player
      if(strId != strPlayerId) {
        objPlayers.push(objPlayerObject);
      }
    }
    return objPlayers;
  };

  /**
   * getMapJson
   * @description
   * This is rendering the Map Json for the External Scripting Engine
   *
   * @param void
   * @return strJson    Json String For the File Output
   */
  this.getMapJson = function() {
    var objMapJson = {};
    var objTileMapLayer = $this.options.tilemap.getLayer(1);
    for(var numX = 0; numX < objTileMapLayer.width; numX++) {
      for(var numY = 0; numY < objTileMapLayer.height; numY++) {
        var objTileType = objTileMapLayer.getTileFromXY(numX, numY);
        var numValue = objTileType.index;
        if(numValue > 0) {
          numValue = 1;
        }
        if(typeof(objMapJson[numX]) == 'undefined') {
          objMapJson[numX] = [];
        }
        objMapJson[numX][numY] = numValue;
      }
    }
    return objMapJson;
  };

  /**
   * initGameLoop
   * @description
   * This is the Initialisation for The Main Game Loop
   *
   * @param void
   * @return void
   */
  this.initGameLoop = function() {
    setTimeout(function() {
      // Config Player
      var objPlayerConfig = {
        tilemap: $this.options.tilemap,
        camera_focus: true,
        player_name: $this.options.ship.name,
        player_color: $this.options.ship.color,
        player_lang:  $this.options.ship.lang
      };
      var objPlayer = new ShipGameObject(_game, _state, objPlayerConfig);
      objPlayer.setTiledPositionInTiles($this.options.ship.pos_x, $this.options.ship.pos_y);
      $this.options.ship.id = objPlayer.options.id;

      // Create Player
      $this.addPlayer(objPlayer);
      $this.getCodingJson();

      // Create Other Players
      // todo:

      // Trigger Main Game Loop
      $this.mainGameLoop();

    }, 2000);
  };

  /**
   * mainGameLoop
   * @description
   * This is the Initialisation for The Main Game Loop
   *
   * @param boolNextStep    If true then do next step
   * @return void
   */
  this.mainGameLoop = function(boolNextStep) {
    // Step1: Write Config
    if($this.options.game_loop.step == 'write_output') {
      $this.gameLoopWriteInput();
      console.log($this.options.game_loop.turn);
      $this.options.game_loop.step = 'trigger_script';
      setTimeout(function() {$this.mainGameLoop();}, 500);
      return;
    }

    // Step2: Trigger Script
    if($this.options.game_loop.step == 'trigger_script') {
      $this.gameLoopTriggerScript();
      // Recal by Trigger Script
    }

    // Step3: Read ship orders
    if($this.options.game_loop.step == 'read_input') {
      $this.gameLoopReadOutput();
      $this.options.game_loop.step = 'set_order';
      $this.mainGameLoop();
    }

    // Step4: Set Order
    if($this.options.game_loop.step == 'set_order') {
      // Only Recall if Next Step if active
      if(!$this.options.game_loop.blockNextStep) {
        $this.gameLoopSetOrder();
      }

      // When all Orders are completted then do next step
      if($this.getLoopSetOrderStatus()) {
        $this.options.game_loop.blockNextStep = false;
        $this.options.game_loop.step = 'pre_events';
        $this.mainGameLoop();
      } else {
        $this.options.game_loop.blockNextStep = true;
        setTimeout(function() {$this.mainGameLoop();}, 100);
        return;
      }
    }

    // Step4: Calculate PreEvents
    if($this.options.game_loop.step == 'set_order') {
      $this.gameLoopCalcPreEvents();
      $this.options.game_loop.step = 'pre_events';
      $this.mainGameLoop();
    }

    // Step5: Execute PreEvents
    if($this.options.game_loop.step == 'pre_events') {
      $this.gameLoopSetOrder();
      $this.options.game_loop.turn++;
      $this.options.game_loop.step = 'write_output';
      $this.mainGameLoop();
    }
    // TODO: Hier könnte mann noch einen Status für versenkt Gameover etc angeben
  };

  /**
   * gameLoopWriteInput
   * @description
   * This Writes the Output Config
   *
   * @param void
   * @return void
   */
  this.gameLoopWriteInput = function() {
    // Get Map Configuration
    var objMapConfig = $this.getCodingJson();
    var strMapConfig = JSON.stringify(objMapConfig);

    // Save Map Config
    var strPath = $this.options.ship.iofolder + '/input.json';
    const objFs = require('fs-jetpack');
    objFs.write(strPath, strMapConfig);
  };

  /**
   * gameLoopTriggerScript
   * @description
   * This is triggering the Player Ship Script
   *
   * @param void
   * @return void
   */
  this.gameLoopTriggerScript = function() {
    // Execute External Ship Script
    var arrExecutable = $this.options.ship.executable.split(' ');
    var strCmd = arrExecutable[0];
    var strParams = arrExecutable[1];

    const {spawn} = require('child_process');
    const objExtenal = spawn(strCmd, [strParams]);

    // JTerminal Console Log
    objExtenal.stdout.on('data', (strMsg) => {
      // todo: strMsg on Jquery Console
    });

    // JTerminal Console Error Log
    objExtenal.stderr.on('data', (strMsg) => {
      // todo: strMsg on Jquery Console
    });

    // On Process Close
    objExtenal.on('close', (code) => {
      // Recal Main Game Loop
      $this.options.game_loop.step = 'read_input';
      $this.mainGameLoop();
    });
  };

  /**
   * gameLoopReadOutput
   * @description
   * This is Reading the Output File
   *
   * @param void
   * @return void
   */
  this.gameLoopReadOutput = function() {
    const objFs = require('fs-jetpack');
    var objOrder = JSON.parse(objFs.read($this.options.ship.iofolder + '/output.json'));

    // Add Ship Orders to Order Array
    var objOrderObj = {
      id: $this.options.ship.id,
      order: objOrder.order
    };
    var numTurn = $this.options.game_loop.turn;
    if(typeof($this.options.game_loop.orders[numTurn]) == 'undefined') {
      $this.options.game_loop.orders[numTurn] = [];
    }
    $this.options.game_loop.orders[numTurn].push(objOrderObj);
  };

  /**
   * gameLoopCalcSetOrder
   * @description
   * Set The Ship Order
   *
   * @param void
   * @return void
   */
  this.gameLoopSetOrder = function() {
    var numTurn = $this.options.game_loop.turn;
    var objOrders = $this.options.game_loop.orders[numTurn];

    // Loop Over All Ship Turn Orders
    for(var numIndex in objOrders) {
      var strShipId = objOrders[numIndex]['id'];
      var strShipOrder = objOrders[numIndex]['order'];

      // Set Ship Orders
      var objPlayer = $this.getPlayer(strShipId);
      objPlayer.setOrder(strShipOrder);
    };
  };

  /**
   * getLoopSetOrderStatus
   * @description
   * This is evaluating the Order Status
   *
   * @param void
   * @return boolFinished   Is true when all Orders are finished
   */
  this.getLoopSetOrderStatus = function() {
    var numTurn = $this.options.game_loop.turn;
    var objOrders = $this.options.game_loop.orders[numTurn];

    // Loop Over All Ship Turn Orders
    var boolFinished = true;
    for(var numIndex in objOrders) {
      var strShipId = objOrders[numIndex]['id'];
      var strShipOrder = objOrders[numIndex]['order'];

      // Set Ship Orders
      var objPlayer = $this.getPlayer(strShipId);
      var strState = objPlayer.options.status;
      if(strState != 'idle' && strState != 'killed') {
        boolFinished = false;
      }
    };
    return boolFinished;
  };

  /**
   * gameLoopCalcPreEvents
   * @description
   * Calculating the PreEvents like Damage or Get Item
   *
   * @param void
   * @return void
   */
  this.gameLoopCalcPreEvents = function() {
    // TODO: Calc pre Events
  };

  /**
   * getState
   * @description
   * This returns the Kiwi Engine GameState
   *
   * @param void
   * @return Kiwi.State
   */
  this.getState = function() {
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
  orderList[1] = 'LOAD_CANNON';
  orderList[2] = 'LOAD_CANNON';
  orderList[3] = 'LOAD_CANNON';
  orderList[4] = 'LOAD_CANNON';
  orderList[5] = 'LOAD_CANNON';
  orderList[6] = 'FIRE_CANNON'; orderParameter[6] = {'cannon': 'left', 'power': 5};
  orderList[7] = 'SHIP_DAMAGE'; orderParameter[7] = {'dmg': 25};
  orderList[8] = 'SHIP_DAMAGE'; orderParameter[8] = {'dmg': 25};
  orderList[9] = 'SHIP_DAMAGE'; orderParameter[9] = {'dmg': 25};

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
