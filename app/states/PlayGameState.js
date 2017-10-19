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
    map: '',
    ship: {},
    tilemap: {},
    players: [],
    map_objects: [],
    map_width: 0,
    map_height: 0,
    game_objects: {
      coins: []
    },
    ship_config: '',
    mission: {},
    game_loop: {
      step: 'write_input',
      init: {},
      orders: [],
      turn: 1,
      blockNextStep: false
    },
    sfx: {
      coin: {}
    },
    jterminal: {}
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
      _state.addJSON('tilemap', 'app/data/maps/' + $this.options.map + '/map.json');
      _state.addSpriteSheet('tiles', 'app/assets/images/tileset/tiles_sheet.png', 64, 64);

      // Load Ships and Object Sprites
      _state.addSpriteSheet('misc', 'app/assets/images/sprites/ships_miscellaneous_sheet.png', 64, 64);
      _state.addSpriteSheet('smoke', 'app/assets/images/sprites/smoke.png', 128, 128);
      _state.addSpriteSheet('bullet', 'app/assets/images/sprites/bullet.png', 12, 12);
      _state.addSpriteSheet('explosion', 'app/assets/images/sprites/explosion.png', 75, 75);
      _state.addSpriteSheet('ships', 'app/assets/images/sprites/ships.png', 76, 123);
      _state.addSpriteSheet('coin', 'app/assets/images/sprites/coins.png', 16, 16);

      // Load Sound Effects
      _state.addAudio('cannon_fire', 'app/assets/sfx/cannon.mp3');
      _state.addAudio('ship_damage', 'app/assets/sfx/explosion.mp3');
      _state.addAudio('ship_move', 'app/assets/sfx/move.mp3');
      _state.addAudio('ship_kill', 'app/assets/sfx/killing.mp3');

      // Load Music
      _state.addAudio('battle_theme', 'app/assets/music/battle.mp3');

      // Load SFX
      _state.addAudio('coin_sfx', 'app/assets/sfx/coin.mp3');
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

    // Create External GUI Components
    $('#Border').css('background-image', 'url("app/assets/images/gui/border_ingame.png")');
    $this.createTerminal();
    $('#Minimap').html('<img src="' + 'app/data/maps/' + $this.options.map + '/map.png' + '" style="position: absolute; left: 0px; top: 0px;">');
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

    // SFX
    var objCoinSfx = new Kiwi.Sound.Audio(_game, 'coin_sfx', 0.1, false);
    $this.options.sfx.coin = objCoinSfx;

    // Create Map Events
    var objMap = JSON.parse(_state.data.tilemap.data);
    $this.options.map_objects = objMap.layers[5]['objects'];
    $this.setPlayerPosition();

    // Set Map Positions
    $this.options.map_height = objMap.height;
    $this.options.map_width = objMap.width;

    // Start InitGame
    $this.initGameLoop();
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

    // Calculate Minimap Icons
    $this.renderMinimap();

    // Calculate Colision with Coin
    $this.coinColider();

    // Block Logic
    $this.blocLogic();
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
    var objJTerminal = $('#JTerminal').terminal(objTerminalTools, {
        greetings: 'GitPirates: 1.0 - Terminal',
        onBlur: function() {
            return false;
        }
    });
    $this.options.jterminal = objJTerminal;
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
    $this.options.map = objMission.map;
  };

  /**
   * setPlayerPosition
   * @description
   * This is setting the Players Position given by the map
   *
   * @param void
   * @return void
   */
  this.setPlayerPosition = function() {
    var objStartPos = {};
    for(var numIndex in $this.options.map_objects) {
      var objMapObject = $this.options.map_objects[numIndex];

      if(objMapObject.name == 'START') {
        var numPosX = parseInt(objMapObject.x / 64);
        var numPosY = parseInt(objMapObject.y / 64);
        $this.options.ship.pos_x = numPosX + 1;
        $this.options.ship.pos_y = numPosY + 1;
      }
    }
    return objStartPos;
  };

  /**
   * createPlayer
   * @description
   * This is creating a Player
   *
   * @param boolFocus   One Player can be focused by the camera
   * @param boolScript  This is the Local Scripted Player
   * @param strName     Player Name
   * @param strColor    Ship Color
   * @param strLang     Coding Language
   * @param numPosX     Position X in tiles
   * @param numPosY     Position Y in tiles
   * @param numHealth   Ship Start Health 0 - 100
   * @return void
   */
  this.createPlayer = function(boolFocus, boolScript, strName, strColor, strLang, numPosX, numPosY, numHealth) {
    var objPlayerConfig = {
      tilemap: $this.options.tilemap,
      camera_focus: boolFocus,
      player_name: strName,
      player_color: strColor,
      player_lang:  'NPC',
      health: numHealth
    };
    var objPlayer = new ShipGameObject(_game, _state, objPlayerConfig);
    objPlayer.setTiledPositionInTiles(numPosX, numPosY);
    if(boolScript) {
      $this.options.ship.id = objPlayer.options.id;
    }

    // Create Minimap Player
    objPlayer.recalcTiledPosition();
    $('#Minimap').append('<img class="ship_' + objPlayer.options.id + '" src="' + 'app/assets/images/sprites/gold_skull.png' + '" style="position: absolute; left: 0px; top: 0px; width: 10px; height: 10px;">');

    // Create Player
    $this.addPlayer(objPlayer);
  };

  /**
   * createCoins
   * @description
   * This renders the Coins to the map
   *
   * @param void
   * @return void
   */
  this.createCoins = function() {
    for(var numIndex in $this.options.map_objects) {
      var objMapObject = $this.options.map_objects[numIndex];

      if(objMapObject.name == 'COIN') {
        var numPosX = parseInt(objMapObject.x / 64);
        var numPosY = parseInt(objMapObject.y / 64);

        // Create Coin Sprite
        var objCoin = new Kiwi.GameObjects.Sprite(_state, 'coin');
        objCoin.animation.add('roate', [0, 1, 2, 3, 4, 5, 6, 7], 0.05);
        objCoin.animation.play('rotate');
        objCoin.x = (numPosX * 64) + 24;
        objCoin.y = (numPosY * 64) + 24;
        objCoin.scaleToHeight(32);
        objCoin.scaleToWidth(32);
        _state.addChild(objCoin);
        $this.options.game_objects.coins.push(objCoin);
        var numCoinId = $this.options.game_objects.coins.length - 1;
        // Create Minimap Coins
        $('#Minimap').append('<img class="coin_' + numCoinId + '" src="' + 'app/assets/images/sprites/coin.png' + '" style="position: absolute; left: 0px; top: 0px; width: 6px; height: 6px;">');
      }
    }
  };

  /**
   * coinColider
   * @description
   * This is calculating if a ship colides with a coin
   *
   * @param void
   * @return void
   */
  this.coinColider = function() {
    for(var numShipIndex in $this.options.players) {
      for(var numObjectIndex in $this.options.game_objects.coins) {
        // Get Coin Position
        var numCoinTileX = ($this.options.game_objects.coins[numObjectIndex]['x'] - 24) / 64;
        var numCoinTileY = ($this.options.game_objects.coins[numObjectIndex]['y'] - 24) / 64;

        // Get Player Position
        var numShipTileX = $this.options.players[numShipIndex].options.position.tile_x;
        var numShipTileY = $this.options.players[numShipIndex].options.position.tile_y;

        // Colider Check
        var objCoin = this.options.game_objects.coins[numObjectIndex];
        if((numCoinTileX == numShipTileX && numCoinTileY == numShipTileY) || objCoin.alpha < 1 ) {
          this.options.game_objects.coins[numObjectIndex].alpha -= 0.01;
        }

        // Play Coin Sound
        if(objCoin.alpha == 0.99) {
          $this.options.sfx.coin.play();
        }

        // Coin Resize Animation on Colision
        if(objCoin.alpha < 1 && objCoin.visible) {
          this.options.game_objects.coins[numObjectIndex].alpha -= 0.01;
          var numSteps = 100 - (this.options.game_objects.coins[numObjectIndex].alpha * 100);
          this.options.game_objects.coins[numObjectIndex].scaleToHeight(32 + numSteps);
          this.options.game_objects.coins[numObjectIndex].scaleToWidth(32 + numSteps);
        }

        // Hide Coin Reset Colider
        if(this.options.game_objects.coins[numObjectIndex].alpha <= 0) {
            this.options.game_objects.coins[numObjectIndex].visible = false;
        }
      }
    }
  };

  /**
   * getCoinCounter
   * @description
   * This returns the actual Coin Status
   *
   * @param void
   * @return objCoinCounter   This is the Object with the Coin Counts
   */
  this.getCoinCounter = function() {
    var objCoinCounter = {
      collected: 0,
      placed: 0,
      total: 0
    };
    for(var numObjectIndex in $this.options.game_objects.coins) {
      if(this.options.game_objects.coins[numObjectIndex].visible) {
        objCoinCounter.placed++;
      } else {
        objCoinCounter.collected++;
      }
      objCoinCounter.total++;
    };
    return objCoinCounter;
  };

  /**
   * blockLogic
   * @description
   * This is calculating the Block Magic for Wall Opening or Closing
   *
   * @param void
   * @return void
   */
  this.blocLogic = function() {
    for(var numIndex in $this.options.map_objects) {
      var objMapObject = $this.options.map_objects[numIndex];
      if(objMapObject.name == 'BLOCK') {
        // Get Block Tile Coordinates
        var numStartPosX = parseInt(objMapObject.x / 64);
        var numStartPosY = parseInt(objMapObject.y / 64);
        var numEndPosX = parseInt((objMapObject.x + objMapObject.width) / 64);
        var numEndPosY = parseInt((objMapObject.y + objMapObject.height) / 64);

        // Get Block Type
        var objBlockType = JSON.parse(objMapObject.type);
        var boolNoBlock = false;

        // Coin Collection Trigger
        if(objBlockType.trigger == 'coin') {
          var objCoinCounter = $this.getCoinCounter();
          if(objBlockType.value <= objCoinCounter.collected) {
            boolNoBlock = true;
          };
        }

        // Kill Trigger
        if(objBlockType.trigger == 'kill') {
          // TODO
        }

        // Open Fortification Block
        if(boolNoBlock) {
          var objTileMapLayer = $this.options.tilemap.getLayer(3);
          for(var numX = numStartPosX; numX <= numEndPosX; numX++) {
            for(var numY = numStartPosY; numY <= numEndPosY; numY++) {
              var objTileType = objTileMapLayer.getTileFromXY(numX, numY);
              if(objTileType.cellIndex != -1) {
                objTileType.cellIndex = -1;
                objTileType.index = 0;
                // TODO: Play Magic Sound
              }
            }
          }
        }
      }
    }
  };

  /**
   * renderMinimap
   * @description
   * This is rendering the Minimap and setting the Player Icons
   *
   * @param void
   * @return void
   */
  this.renderMinimap = function() {
    // Get Map Dimensions
    var numMinimapWidth = $('#Minimap img').width();
    var numMinimapHeight = $('#Minimap img').height();
    var numRealMapWidth = $this.options.map_width * 64;
    var numRealMapHeight = $this.options.map_height * 64;

    // Render Minimap Icons
    for(var numIndex in $this.options.players) {
      // Get Real Ship Position
      var numShipX = $this.options.players[numIndex].options.position.tile_x * 64;
      var numShipY = $this.options.players[numIndex].options.position.tile_y * 64;

      // Get Real Ship Percent Position
      var numShipPercentX = 100 / numRealMapWidth * numShipX;
      var numShipPercentY = 100 / numRealMapHeight * numShipY;

      // Get Minimap Position by Percent
      var numMinimapX = Math.round(numMinimapWidth / 100 * numShipPercentX);
      var numMinimapY = Math.round(numMinimapHeight / 100 * numShipPercentY);

      // Set Ship Icon
      var strShipId = $this.options.players[numIndex].options.id;
      $('img.ship_' + strShipId).css('left', numMinimapX - 4);
      $('img.ship_' + strShipId).css('top', numMinimapY - 3);
    }

    // Render Objects
    for(var numIndex in $this.options.game_objects.coins) {
      // Get Real Object Position
      var numObjectX = $this.options.game_objects.coins[numIndex].x;
      var numObjectY = $this.options.game_objects.coins[numIndex].y;

      // Get Real Object Percent Position
      var numShipPercentX = 100 / numRealMapWidth * numObjectX;
      var numShipPercentY = 100 / numRealMapHeight * numObjectY;

      // Get Minimap Position by Percent
      var numMinimapX = Math.round(numMinimapWidth / 100 * numShipPercentX);
      var numMinimapY = Math.round(numMinimapHeight / 100 * numShipPercentY);

      // Set Object Icon
      var strType = $this.options.game_objects.coins[numIndex].name.toLowerCase();
      $('img.' + strType + '_' + numIndex).css('left', numMinimapX - 3);
      $('img.' + strType + '_' + numIndex).css('top', numMinimapY - 3);

      // Hide Colected Coins
      if($this.options.game_objects.coins[numIndex].visible == false) {
        $('img.' + strType + '_' + numIndex).hide();
      };
    }
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
    var objSpecial = $this.getSpecials();
    var objMapJson = $this.getMapJson();

    var objCoding = {
      general: objGeneralJson,
      player: objPlayerJson,
      players: objPlayersJson,
      specials: objSpecial,
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
   * getSpecials
   * @description
   * This is rendering the Map Json for the External Scripting Engine
   *
   * @param void
   * @return objSpecials    This Array Contains the Special Objects
   */
  this.getSpecials = function() {
    // Prepare Specials Object
    var arrSpecials = {
      coin: [],
      block: [],
      enemy: [],
      start: [],
      end: []
    };

    // Create Specials Object
    for(var numIndex in $this.options.map_objects) {
      var objGameObject = $this.options.map_objects[numIndex];
      // Parse Param Object
      var objParam = {};
      if(objGameObject.type.length > 0) {
        objParam = JSON.parse(objGameObject.type);
      }

      // Create Special
      var objSpecial = {
        params: objParam,
        pos_x: parseInt(objGameObject.x / 64),
        pos_y: parseInt(objGameObject.y / 64)
      }
      var strName = objGameObject.name.toLowerCase();
      arrSpecials[strName].push(objSpecial);
    }
    return arrSpecials;
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

        // Add Fortification
        var objFortMapLayer = $this.options.tilemap.getLayer(3);
        var objFortTile = objFortMapLayer.getTileFromXY(numX, numY);
        numValue += objFortTile.index;

        // Calculate Map Array
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
      // Create NPC Players
      var objSpecials = $this.getSpecials();
      for(var numIndex in objSpecials.enemy) {
        var objEnemy = objSpecials.enemy[numIndex];
        //$this.createPlayer(true, false, objEnemy.params.name, objEnemy.params.color, 'NPC', objEnemy.pos_x + 1, objEnemy.pos_y + 1, objEnemy.params.health);
        $this.createPlayer(true, false, objEnemy.params.name, objEnemy.params.color, 'NPC', 19, 26, objEnemy.params.health);
      }

      // Create Other Players
      // todo:

      // Create Player
      var objPlayer = $this.options.ship;
      $this.createPlayer(false, true, objPlayer.name, objPlayer.color, objPlayer.lang, objPlayer.pos_x, objPlayer.pos_y, 100);

      // Get Coding JSON
      $this.getCodingJson();

      // Create Coins
      $this.createCoins();

      // Trigger Main Game Loop
      $this.mainGameLoop();

    }, 2000);
  };

  /**
   * mainGameLoop
   * @description
   * This is the Initialisation for The Main Game Loop
   *
   * @param void
   * @return void
   */
  this.mainGameLoop = function() {
    // Step1: Write Config
    if($this.options.game_loop.step == 'write_input') {
      $this.gameLoopWriteInput();
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
    if($this.options.game_loop.step == 'read_output') {
      $this.gameLoopReadOutput();
      $this.options.game_loop.step = 'set_order';
      $this.mainGameLoop();
      return;
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
        $this.options.game_loop.step = 'calc_pre_events';
        $this.mainGameLoop();
        return;
      } else {
        // Recall
        $this.options.game_loop.blockNextStep = true;
        $this.options.game_loop.step = 'set_order';
        setTimeout(function() {$this.mainGameLoop();}, 100);
        return;
      }
    }

    // Step4: Calculate PreEvents
    if($this.options.game_loop.step == 'calc_pre_events') {
      $this.gameLoopCalcPreEvents();
      $this.options.game_loop.step = 'pre_events';
      $this.mainGameLoop();
      return;
    }

    // Step5: Execute PreEvents
    if($this.options.game_loop.step == 'pre_events') {
      $this.gameLoopSetOrder();
      $this.options.game_loop.turn++;
      $this.options.game_loop.step = 'write_input';
      $this.mainGameLoop();
      return;
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
      // TODO: color lightblue
      $this.options.jterminal.echo(strMsg);
    });

    // JTerminal Console Error Log
    objExtenal.stderr.on('data', (strMsg) => {
      // TODO: Color Red
      $this.options.jterminal.echo(strMsg);
    });

    // On Process Close
    objExtenal.on('close', (code) => {
      // Recal Main Game Loop
      $this.options.game_loop.step = 'read_output';
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

      // Extract Parameters
      objParam = {};
      if(strShipOrder.indexOf(':') > 0) {
        var strParamJson = strShipOrder.substring(strShipOrder.indexOf(':') + 1);
        var strShipOrder = strShipOrder.substring(0, strShipOrder.indexOf(':'));
        objParam = JSON.parse(strParamJson);
      }

      // Set Ship Orders
      var objPlayer = $this.getPlayer(strShipId);
      objPlayer.setOrder(strShipOrder, objParam);
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
