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
  var _helper = new Helper();
  var _npcHelper = new NpcHelper();

  // CodePirate System Variables
  this.options = $.extend({
    map: '',
    ship: {},
    tilemap: {},
    players: [],
    player_state: '',
    map_objects: [],
    map_width: 0,
    map_height: 0,
    game_objects: {
      coins: [],
      targets: []
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
      coins: {},
      targets: {},
    },
    music: {
      battle_theme: {},
      victory: {},
      defeat: {},
      gameover: {}
    },
    gui: {
      banner: {},
      title: {},
      subtext: {},
      menubtn: {}
    },
    click: {},
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
      _state.addSpriteSheet('target', 'app/assets/images/sprites/target.png', 48, 48);

      // Banners
      _state.addImage('banner_ingame', 'app/assets/images/gui/banner_ingame.png', true, 600, 260);
      _state.addSpriteSheet('menu_button', 'app/assets/images/gui/menu_button.png', 204, 54);

      // Load Sound Effects
      _state.addAudio('cannon_fire', 'app/assets/sfx/cannon.mp3');
      _state.addAudio('ship_damage', 'app/assets/sfx/explosion.mp3');
      _state.addAudio('ship_move', 'app/assets/sfx/move.mp3');
      _state.addAudio('ship_kill', 'app/assets/sfx/killing.mp3');

      // Load Music
      _state.addAudio('battle_theme', 'app/assets/music/battle.mp3');
      _state.addAudio('victory_theme', 'app/assets/music/victory.mp3');
      _state.addAudio('defeat_theme', 'app/assets/music/defeat.mp3');

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
    // Reset Game
    $this.options.player_state = '';
    $this.options.players = [];
    $this.options.map_objects = [];
    $this.options.game_objects = {coins: [],targets: []};
    $this.options.game_loop = {step: 'write_input',init: {},orders: [],turn: 1,blockNextStep: false};
    $this.options.click = {};
    
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
    $this.options.music.battle_theme = objBattleThemeMusic;

    // Create Victory music
    var objVictoryThemeMusic = new Kiwi.Sound.Audio(_game, 'victory_theme', 0.3, true);
    $this.options.music.victory = objVictoryThemeMusic;

    // Create Defeat music
    var objDefeatThemeMusic = new Kiwi.Sound.Audio(_game, 'defeat_theme', 0.3, true);
    $this.options.music.defeat = objDefeatThemeMusic;

    // SFX
    var objCoinSfx = new Kiwi.Sound.Audio(_game, 'coin_sfx', 0.1, false);
    $this.options.sfx.coins = objCoinSfx;
    $this.options.sfx.targets = objCoinSfx; // TODO: Add Victory sound

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

    // Show Victory Banner
    if($this.options.player_state == 'victory') {
      $this.renderBanner('Victory', 'You are now qualified for Multiplayer.');
      return
    };

    // Show Defeat Banner
    if($this.options.player_state == 'defeat') {
      $this.renderBanner('Defeated', 'You are defeated optimize your code.');
      return
    };

    // Execute Orders of all Players
    for(var strId in $this.options.players) {
      $this.options.players[strId].executeOrderOnUpdate();

      if($this.options.ship.id == strId) {
        $this.options.ship.pos_x = $this.options.players[strId].options.position.tile_x;
        $this.options.ship.pos_y = $this.options.players[strId].options.position.tile_y;
        $this.options.ship.direction = $this.options.players[strId].options.direction;
        $this.options.ship.status = $this.options.players[strId].options.status;
      }

    }

    // Calculate Minimap Icons
    $this.renderMinimap();

    // Calculate Object Collision
    $this.objectColider('coins');
    $this.objectColider('targets');

    // Block Logic
    $this.blockLogic();
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
    $this.options.ship.direction = 'S';
    $this.options.ship.status = 'idle';
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
      player_lang:  strLang,
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
   * createTarget
   * @description
   * This renders the Target to the map
   *
   * @param void
   * @return void
   */
  this.createTarget = function() {
    for(var numIndex in $this.options.map_objects) {
      var objMapObject = $this.options.map_objects[numIndex];

      if(objMapObject.name == 'END') {
        var numPosX = parseInt(objMapObject.x / 64);
        var numPosY = parseInt(objMapObject.y / 64);

        // Create Coin Sprite
        var objTarget = new Kiwi.GameObjects.Sprite(_state, 'target');
        objTarget.animation.add('animate', [0, 1, 2, 3], 0.1, true);
        objTarget.animation.play('animate');
        objTarget.x = (numPosX * 64) + 8;
        objTarget.y = (numPosY * 64) + 8;

        objTarget.x = (31 * 64) + 8;
        objTarget.y = (24 * 64) + 8;

        objTarget.scaleToHeight(64);
        objTarget.scaleToWidth(64);
        _state.addChild(objTarget);
        $this.options.game_objects.targets.push(objTarget);
        var numTargetId = $this.options.game_objects.targets.length - 1;
        // Create Minimap Coins
        $('#Minimap').append('<img class="target_' + numTargetId + '" src="' + 'app/assets/images/sprites/finish.png' + '" style="position: absolute; left: 0px; top: 0px; width: 6px; height: 6px;">');
      }
    }
  };

  /**
   * objectColider
   * @description
   * This is calculating if a ship colides with a coin
   *
   * @param strObjType    Coins, Targets
   * @return void
   */
  this.objectColider = function(strObjType) {
    for(var numShipIndex in $this.options.players) {
      for(var numObjectIndex in $this.options.game_objects[strObjType]) {
        // Get Coin Position
        if(strObjType == 'coins') {
          var numColiderTileX = ($this.options.game_objects[strObjType][numObjectIndex]['x'] - 24) / 64;
          var numColiderTileY = ($this.options.game_objects[strObjType][numObjectIndex]['y'] - 24) / 64;
        }

        // Get Target Position
        if(strObjType == 'targets') {
          var numColiderTileX = ($this.options.game_objects[strObjType][numObjectIndex]['x'] - 8) / 64;
          var numColiderTileY = ($this.options.game_objects[strObjType][numObjectIndex]['y'] - 8) / 64;
        }

        // Get Player Position
        var numShipTileX = $this.options.players[numShipIndex].options.position.tile_x;
        var numShipTileY = $this.options.players[numShipIndex].options.position.tile_y;

        // Colider Check
        var objColider = this.options.game_objects[strObjType][numObjectIndex];
        if((numColiderTileX == numShipTileX && numColiderTileY == numShipTileY) || objColider.alpha < 1 ) {
          this.options.game_objects[strObjType][numObjectIndex].alpha -= 0.01;
        }

        // Play Colider Sound
        if(objColider.alpha == 0.99) {
          $this.options.sfx[strObjType].play();
        }

        // IF Target Colision then Finish
        if(strObjType == 'targets' && objColider.alpha == 0.99) {
          $this.options.player_state = 'victory';
        }

        // Resize Animation on Colision
        if(objColider.alpha < 1 && objColider.visible) {
          this.options.game_objects[strObjType][numObjectIndex].alpha -= 0.01;
          var numSteps = 100 - (this.options.game_objects[strObjType][numObjectIndex].alpha * 100);
          this.options.game_objects[strObjType][numObjectIndex].scaleToHeight(32 + numSteps);
          this.options.game_objects[strObjType][numObjectIndex].scaleToWidth(32 + numSteps);
        }

        // Hide Reset Colider
        if(this.options.game_objects[strObjType][numObjectIndex].alpha <= 0) {
            this.options.game_objects[strObjType][numObjectIndex].visible = false;
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
  this.blockLogic = function() {
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

        // Break if no map_objects
        if(typeof(objBlockType) == 'undefined') {
          return;
        }

        // Coin Collection Trigger
        if(objBlockType.trigger == 'coin') {
          var objCoinCounter = $this.getCoinCounter();
          if(objBlockType.value <= objCoinCounter.collected) {
            boolNoBlock = true;
          };
        }

        // Kill Trigger
        if(objBlockType.trigger == 'kill') {
          boolNoBlock = false;
        }

        // Open Fortification Block
        if(boolNoBlock) {
          var objTileMapLayer = $this.options.tilemap.getLayer(3);
          for(var numX = numStartPosX; numX <= numEndPosX; numX++) {
            for(var numY = numStartPosY; numY <= numEndPosY; numY++) {
              var objTileType = objTileMapLayer.getTileFromXY(numX, numY);
              // TODO: Only One Gate
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
      $('img.ship_' + strShipId).css('left', numMinimapX - 3);
      $('img.ship_' + strShipId).css('top', numMinimapY - 3);
    }

    // Render Objects
    for(var strObjectGroup in $this.options.game_objects) {
      for(var numIndex in $this.options.game_objects[strObjectGroup]) {
        // Get Real Object Position
        var numObjectX = $this.options.game_objects[strObjectGroup][numIndex].x;
        var numObjectY = $this.options.game_objects[strObjectGroup][numIndex].y;

        // Get Real Object Percent Position
        var numShipPercentX = 100 / numRealMapWidth * numObjectX;
        var numShipPercentY = 100 / numRealMapHeight * numObjectY;

        // Get Minimap Position by Percent
        var numMinimapX = Math.round(numMinimapWidth / 100 * numShipPercentX);
        var numMinimapY = Math.round(numMinimapHeight / 100 * numShipPercentY);

        // Set Object Icon
        var strType = $this.options.game_objects[strObjectGroup][numIndex].name.toLowerCase();
        $('img.' + strType + '_' + numIndex).css('left', numMinimapX - 3);
        $('img.' + strType + '_' + numIndex).css('top', numMinimapY - 3);

        // Hide Colected Coins
        if($this.options.game_objects[strObjectGroup][numIndex].visible == false) {
          $('img.' + strType + '_' + numIndex).hide();
        };
      }
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
        $this.createPlayer(false, false, objEnemy.params.name, objEnemy.params.color, 'NPC', objEnemy.pos_x + 1, objEnemy.pos_y + 1, objEnemy.params.health);
      }

      // Create Other Players
      // todo:

      // Create Player
      var objPlayer = $this.options.ship;
      $this.createPlayer(true, true, objPlayer.name, objPlayer.color, objPlayer.lang, objPlayer.pos_x, objPlayer.pos_y, 100);

      // Get Coding JSON
      $this.getCodingJson();

      // Create Coins
      $this.createCoins();

      // Create Target
      $this.createTarget();

      // Create Banner Ingame
      var objBannerIngame = new Kiwi.GameObjects.Sprite(_state, 'banner_ingame');
      objBannerIngame.x = 20;
      objBannerIngame.y = 180;
      objBannerIngame.alpha = 0;
      _state.addChild(objBannerIngame);
      $this.options.gui.banner = objBannerIngame;

      // Create Banner Button
      var objMenuBtn = new Kiwi.GameObjects.Sprite(_state, 'menu_button');
      objMenuBtn.x = -400;
      objMenuBtn.y = -400;
      objMenuBtn.animation.switchTo(2);
      _state.addChild(objMenuBtn);
      $this.options.gui.menubtn = objMenuBtn;

      // Trigger Main Game Loop
      $this.mainGameLoop();
    }, 50);
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
    // Quit Loop on finish
    if($this.options.player_state != '') {
      return;
    }

    // Step1: Write Config
    if($this.options.game_loop.step == 'write_input') {
      console.log($this.options.game_loop.turn);
      $this.gameLoopWriteInput();
      $this.options.game_loop.step = 'trigger_script';
      setTimeout(function() {$this.mainGameLoop();}, 1);
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
      $this.gameLoopGetNpcOrder(); // TODO: only in Singleplayer
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
        $this.options.game_loop.step = 'calc_post_events';
        $this.mainGameLoop();
        return;
      } else {
        // Recall
        $this.options.game_loop.blockNextStep = true;
        $this.options.game_loop.step = 'set_order';
        setTimeout(function() {$this.mainGameLoop();}, 1);
        return;
      }
    }

    // Step4: Calculate PostEvents
    if($this.options.game_loop.step == 'calc_post_events') {
      $this.gameLoopCalcPostEvents();
      $this.options.game_loop.step = 'post_events';
      $this.mainGameLoop();
      return;
    }

    // Step5: Execute PostEvents
    if($this.options.game_loop.step == 'post_events') {
      // Only Recall if Next Step if active
      if(!$this.options.game_loop.blockNextStep) {
        $this.gameLoopSetOrder('Post');
      }

      // When all Orders are completted then do next step
      if($this.getLoopSetOrderStatus('Post')) {
        $this.options.game_loop.blockNextStep = false;
        $this.options.game_loop.turn++;
        $this.options.game_loop.step = 'write_input';
        if($this.options.ship.status == 'killed') {
          $this.options.player_state = 'defeat';
        }
        $this.mainGameLoop();

        return;
      } else {
        // Recall
        $this.options.game_loop.blockNextStep = true;
        $this.options.game_loop.step = 'post_events';
        setTimeout(function() {$this.mainGameLoop();}, 1);
        return;
      }
    }
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

    // Ship Order
    if(objOrder.order == '') {
      return;
    }

    // Add Ship Orders to Order Array
    var objOrderObj = {
      id: $this.options.ship.id,
      order: objOrder.order
    };
    var numTurn = $this.options.game_loop.turn;
    if(typeof($this.options.game_loop.orders[numTurn]) == 'undefined') {
      $this.options.game_loop.orders[numTurn] = [];
      $this.options.game_loop.orders[numTurn + '_Post'] = [];
    }
    $this.options.game_loop.orders[numTurn].push(objOrderObj);
  };

  /**
   * gameLoopCalcSetOrder
   * @description
   * Set The Ship Order
   *
   * @param strSuffix   This is the Turn Suffix
   * @return void
   */
  this.gameLoopSetOrder = function(strSuffix) {
    // Set Suffix
    var numTurn = $this.options.game_loop.turn;
    if(typeof(strSuffix) != 'undefined') {
      numTurn = numTurn + '_' + strSuffix;
    }
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
   * gameLoopGetNpcOrder
   * @description
   * Set The NPC Ship Order
   *
   * @param void
   * @return void
   */
  this.gameLoopGetNpcOrder = function() {
    // NPC Callculations
    var objMapConfig = $this.getCodingJson();
    for(var strId in $this.options.players) {
      var objNpcPlayer = $this.options.players[strId];
      if(objNpcPlayer.options.player_lang == 'NPC') {
        var strShipOrder = _npcHelper.getNpcCommand(objMapConfig, objNpcPlayer);
        // Ship Order
        if(strShipOrder == '') {
          return;
        }

        // Add Ship Orders to Order Array
        var objOrderObj = {
          id: objNpcPlayer.options.id,
          order: strShipOrder
        };
        var numTurn = $this.options.game_loop.turn;
        if(typeof($this.options.game_loop.orders[numTurn]) == 'undefined') {
          $this.options.game_loop.orders[numTurn] = [];
          $this.options.game_loop.orders[numTurn + '_Post'] = [];
        }
        $this.options.game_loop.orders[numTurn].push(objOrderObj);
      }
    }
  };

  /**
   * getLoopSetOrderStatus
   * @description
   * This is evaluating the Order Status
   *
   * @param void
   * @return boolFinished   Is true when all Orders are finished
   */
  this.getLoopSetOrderStatus = function(strSuffix) {
    // Set Suffix
    var numTurn = $this.options.game_loop.turn;
    if(typeof(strSuffix) != 'undefined') {
      numTurn = numTurn + '_' + strSuffix;
    }
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
   * gameLoopCalcPostEvents
   * @description
   * Calculating the PostEvents like Damage or Get Item
   *
   * @param void
   * @return void
   */
  this.gameLoopCalcPostEvents = function() {
    // Create Post Order Array
    var numTurn = $this.options.game_loop.turn + '_Post';

    // Calculate Hits
    var arrPlayerPos = $this.getPlayerTilePositions();

    // Get CannonHit Positions
    var arrCannonHits = $this.getCannonHitPositions();

    // Calculate Hits
    for(var numCannonIndex in arrCannonHits) {
      var objCannon = arrCannonHits[numCannonIndex];

      for(var numPlayerIndex in arrPlayerPos) {
        var objPlayer = arrPlayerPos[numPlayerIndex];

        // Check if its a HIT
        if(objPlayer['tile_x'] == objCannon['tile_x'] && objPlayer['tile_y'] == objCannon['tile_y']) {
          var objOrderObj = {
            id: objPlayer['id'],
            order: 'SHIP_DAMAGE:{"dmg": 10}'
          };
          $this.options.game_loop.orders[numTurn].push(objOrderObj);
          // TODO: GUI MESSAGE WITH HIT OR KILL INFO
          // console.log(objCannon.shooter, "IS HITING", objPlayer['id']);
        }
      }
    }

    // Ship Collision
    for(var numPlayer1Index in arrPlayerPos) {
      var objPlayer1 = arrPlayerPos[numPlayer1Index];
      for(var numPlayer2Index in arrPlayerPos) {
        var objPlayer2 = arrPlayerPos[numPlayer2Index];
        if(objPlayer1['tile_x'] == objPlayer2['tile_x'] && objPlayer1['tile_y'] == objPlayer2['tile_y']) {
          if(objPlayer1['status'] != 'killed' && objPlayer2['status'] != 'killed') {
            if(objPlayer1.id != objPlayer2.id) {
              var objOrderObj = {id: objPlayer1['id'], order: 'SHIP_DAMAGE:{"dmg": 100}'};
              $this.options.game_loop.orders[numTurn].push(objOrderObj);
              var objOrderObj = {id: objPlayer2['id'], order: 'SHIP_DAMAGE:{"dmg": 100}'};
              $this.options.game_loop.orders[numTurn].push(objOrderObj);
            }
          }
        }
      }
    }
  };

  /**
   * getPlayerTilePositions
   * @description
   * Get Player Tile Position
   *
   * @param void
   * @return objPlayerTilePosition  This is the Player Position Array
   */
  this.getPlayerTilePositions = function() {
    var objPlayerTilePosition = [];
    for(var strId in $this.options.players) {
      var objPlayer = {
        id: $this.options.players[strId]['options']['id'],
        tile_x: $this.options.players[strId]['options']['position']['tile_x'],
        tile_y: $this.options.players[strId]['options']['position']['tile_y'],
        status: $this.options.players[strId]['options']['status']
      };
      objPlayerTilePosition.push(objPlayer);
    }
    return objPlayerTilePosition;
  };

  /**
   * getCannonHitPositions
   * @description
   * Get Cannon hit Positions
   *
   * @param void
   * @return objCannonHitPosition  This is the Cannon Hit Position Array
   */
  this.getCannonHitPositions = function() {
    var objCannonHitPosition = [];
    for(var strId in $this.options.players) {
      var objPlayer = $this.options.players[strId];
      var objFired = objPlayer.options.cannon_fire;
      if(objFired.fired) {
        // Get Hit
        var objCannonHit = {
          shooter: $this.options.players[strId]['options']['id'],
          tile_x: objFired.pos_x,
          tile_y: objFired.pos_y
        };
        objCannonHitPosition.push(objCannonHit);
      }

      // Reset Player Hit Calculation
      objPlayer.resetHitCalculation();
    }
    return objCannonHitPosition;
  };

  /**
   * renderBanner
   * @description
   * Rendering a Information Banner
   *
   * @param strTitle      Banner Title
   * @param strSubText    Banner Subtext
   * @return void
   */
  this.renderBanner = function(strTitle, strSubText) {
    // Remove All Gui Widgets
    if($this.options.gui.banner.alpha == 0) {
      _game.huds.defaultHUD.removeAllWidgets();
      $this.options.music.battle_theme.stop();

      // Play Music
      if($this.options.player_state == 'victory') {
        $this.options.music.victory.play();
      }
      if($this.options.player_state == 'defeat') {
        $this.options.music.defeat.play();
      }

      // Render Title Text
      var objTitle = new Kiwi.HUD.Widget.TextField (_game, strTitle, 240, 210);
      objTitle.style.fontFamily = "Germania One";
      objTitle.style.fontSize = "64px";
      objTitle.style.textAlign = "center";
      objTitle.style.color = "#000000";
      _game.huds.defaultHUD.addWidget(objTitle);
      $this.options.gui.title = objTitle;

      // Render SubText
      var objSubText = new Kiwi.HUD.Widget.TextField (_game, strSubText, 150, 300);
      objSubText.style.fontFamily = "Germania One";
      objSubText.style.fontSize = "24px";
      objSubText.style.textAlign = "center";
      objSubText.style.color = "#000000";
      _game.huds.defaultHUD.addWidget(objSubText);
      $this.options.gui.subtext = objSubText;

      // Render Button
      $this.options.gui.menubtn.x = $this.options.ship.pos_x * 64 - 60
      $this.options.gui.menubtn.y = $this.options.ship.pos_y * 64 + 90
    }

    // MenuBtn Handling
    if(_helper.isMouseOver(228, 379, 204, 55)) {
      $this.options.gui.menubtn.animation.switchTo(0);
      if(_helper.isMousePressed() && !$this.options.click.menubtn) {
        $this.options.click.menubtn = true;
        // Back To MainMenu
        _game.huds.defaultHUD.removeAllWidgets();
        $this.options.music.victory.stop();
        $this.options.music.defeat.stop();
        $this.options.music.battle_theme.stop();

        // Remove External Elements
        $('#Border').css('background-image', '');
        $('#Minimap').html('');
        $('.ingame').hide();

        _game.states.switchState("MainMenuState");
      }
    } else {
      $this.options.gui.menubtn.animation.switchTo(2);
    }

    // Render Banner Position
    var numX = $this.options.ship.pos_x * 64 - 265;
    var numY = $this.options.ship.pos_y * 64 - 80;
    $this.options.gui.banner.x = numX;
    $this.options.gui.banner.y = numY;

    // Render Banner Income animation
    $this.options.gui.banner.alpha += 0.01;
    $this.options.gui.banner.scaleToWidth(600 / 100 * ($this.options.gui.banner.alpha * 100));
    $this.options.gui.banner.scaleToHeight(260 / 100 * ($this.options.gui.banner.alpha * 100));
    $this.options.gui.title.style.opacity = $this.options.gui.banner.alpha;
    $this.options.gui.subtext.style.opacity = $this.options.gui.banner.alpha;
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
