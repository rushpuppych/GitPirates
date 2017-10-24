/**
 * ShipGameObject
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var ShipGameObject = function(game, state, options) {
  var $this = this;
  var _private = {};
  var _game = game;
  var _state = state;
  var helper = new Helper();

  // CodePirate System Variables
  this.options = $.extend({
    id: helper.uuid(),
    status: 'idle',
    kickback: false,
    direction: 'S',
    current_order: 'none',
    current_order_parameter: {},
    player_name: 'Undefined',
    player_color: 'red',
    script_lang: '???',
    health: 100,
    cannon_loads: 0,
    hud: {
      playerText: {},
      actionText: {},
      healthBar: {},
      cannonBar: {}
    },
    ship_animation: {
      ship_100: 0,
      ship_75: 0,
      ship_30: 0,
      ship_0: 0
    },
    animation_steps: {
      moveNorth: 0,
      moveEast: 0,
      moveSouth: 0,
      moveWest: 0,
      turnLeft: 0,
      turnRight: 0,
      loadCannon: 0,
      fireCannon: 0,
      shipDamage: 0
    },
    position: {
      tile_x: 1,
      tile_y: 1
    },
    sfx: {
      cannon_fire: {},
      ship_damage: {},
      ship_move: {},
      ship_kill: {}
    },
    cannon_fire: {
      fired: false,
      pos_x: 0,
      pos_y: 0
    },
    gameObject: {},
    smoke: {},
    bullet: {},
    explosion: {},
    tilemap: {},
    camera_focus: false,
  }, options);

  /**
   * Constructor
   */
  this.init = function() {
    // Smoke SpriteSheet
    var objSmoke = new Kiwi.GameObjects.Sprite(_state, 'smoke');
  	objSmoke.animation.add('fire', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.05);
    objSmoke.visible = false;
  	_state.addChild(objSmoke);
    $this.options.smoke = objSmoke;

    // Cannon Bullet
    var objBullet = new Kiwi.GameObjects.Sprite(_state, 'bullet');
    objBullet.visible = false;
    _state.addChild(objBullet);
    $this.options.bullet = objBullet;

    // Create Ship Object
    var objShip = new Kiwi.GameObjects.Sprite(_state, _state.textures.ships);
    $this.registerShip($this.options.player_color);
    objShip.animation.switchTo($this.options.ship_animation.ship_100);
    objShip.rotation = 0;
    _state.addChild(objShip);
    $this.options.gameObject = objShip;

    // Explode SpriteSheet
    var objExplosion = new Kiwi.GameObjects.Sprite(_state, 'explosion');
  	objExplosion.animation.add('explode', [2, 1, 0, 0, 1, 2], 0.05, false);
    objExplosion.visible = false;
    objExplosion.animation.onStop.add(function() {
      var objCorrection = _private.getCorrectionPosition($this.options.explosion);
      var objTiledPosition = $this.getTiledPosition();
      var numRandX = parseInt(Math.random() * 50) - 25;
      var numRandY = parseInt(Math.random() * 50) - 25;
      $this.options.explosion.y = objTiledPosition.tile_y * 64 + objCorrection.height + numRandY;
      $this.options.explosion.x = objTiledPosition.tile_x * 64 + objCorrection.width + numRandY;
      $this.options.explosion.animation.play('explode');
    });
  	_state.addChild(objExplosion);
    $this.options.explosion = objExplosion;

    // Create Player Name Text
    var objPlayerText = new Kiwi.HUD.Widget.TextField (_game, $this.options.player_name, objShip.x, objShip.y - 22);
    objPlayerText.style.fontFamily = "Germania One";
    objPlayerText.style.fontSize = "14px";
    objPlayerText.style.color = "#000000";
    _game.huds.defaultHUD.addWidget(objPlayerText);
    $this.options.hud.playerText = objPlayerText;

    // Create Player Action Text
    var objActionText = new Kiwi.HUD.Widget.TextField (_game, "", objShip.x, objShip.y + 60);
    objActionText.style.fontFamily = "Germania One";
    objActionText.style.fontSize = "30px";
    objActionText.style.color = "#610B0B";
    _game.huds.defaultHUD.addWidget(objActionText);
    $this.options.hud.actionText = objActionText;

    // Create Health Bar
    var objBackground = new Kiwi.HUD.Widget.Bar(_game, 100, 100, objShip.x - 1, objShip.y - 1, 72, 7, '#000000' );
    _game.huds.defaultHUD.addWidget(objBackground);
    $this.options.hud.healthBar.bg = objBackground;

    var objHealthBar = new Kiwi.HUD.Widget.Bar(_game, $this.options.health, 100, objShip.x, objShip.y, 70, 5, '#ff0000' );
    _game.huds.defaultHUD.addWidget(objHealthBar);
    $this.options.hud.healthBar.bar = objHealthBar;

    // Create Cannon Bar
    var objBackground = new Kiwi.HUD.Widget.Bar(_game, 100, 100, objShip.x - 1, objShip.y + 9, 72, 7, '#000000' );
    _game.huds.defaultHUD.addWidget(objBackground);
    $this.options.hud.cannonBar.bg = objBackground;

    var objCannonBar = new Kiwi.HUD.Widget.Bar(_game, $this.options.cannon_loads, 10, objShip.x, objShip.y + 10, 70, 5, '#2ECCFA' );
    _game.huds.defaultHUD.addWidget(objCannonBar);
    $this.options.hud.cannonBar.bar = objCannonBar;

    // Create Cannon Fire sfx
    var objCannonFireSfx = new Kiwi.Sound.Audio(_game, 'cannon_fire', 0.5, false);
    $this.options.sfx.cannon_fire = objCannonFireSfx;

    // Create Ship Damage sfx
    var objShipDamageSfx = new Kiwi.Sound.Audio(_game, 'ship_damage', 0.5, false);
    $this.options.sfx.ship_damage = objShipDamageSfx;

    // Create Ship Move sfx
    var objShipMoveSfx = new Kiwi.Sound.Audio(_game, 'ship_move', 0.1, false);
    $this.options.sfx.ship_move = objShipMoveSfx;

    // Create Ship Killing
    var objShipKill = new Kiwi.Sound.Audio(_game, 'ship_kill', 0.2, false);
    $this.options.sfx.ship_kill = objShipKill;

    // Init Values
    $this.resetAnimationSteps();
    $this.recalcTiledPosition();
  };

  /**
   * registerShip
   * @description
   * This is the Animation Step Register for all the Available Ships
   *
   * @param strColor    Ship Color
   * @return void
   */
  this.registerShip = function(strColor, objShip) {
    if(strColor == 'green') {
      $this.options.ship_animation = {ship_100: 6, ship_75: 0, ship_30: 7, ship_0: 15};
    }
    if(strColor == 'blue') {
      $this.options.ship_animation = {ship_100: 13, ship_75: 1, ship_30: 8, ship_0: 16};
    }
    if(strColor == 'red') {
      $this.options.ship_animation = {ship_100: 19, ship_75: 23, ship_30: 5, ship_0: 14};
    }
    if(strColor == 'yellow') {
      $this.options.ship_animation = {ship_100: 20, ship_75: 2, ship_30: 9, ship_0: 17};
    }
    if(strColor == 'black') {
      $this.options.ship_animation = {ship_100: 18, ship_75: 22, ship_30: 4, ship_0: 12};
    }
    if(strColor == 'white') {
      $this.options.ship_animation = {ship_100: 11, ship_75: 21, ship_30: 3, ship_0: 10};
    }
  }

  /**
   * executeOrderOnUpdate
   * @description
   * This will be called in the Update Routine and executes the current_order
   *
   * @param void
   * @return void
   */
  this.executeOrderOnUpdate = function() {
    switch($this.options.current_order) {
      case 'MOVE_FORWARDS':
        $this.options.status = 'move';
        _private.moveForwards();
        _private.checkKickBack();
      break;

      case 'MOVE_BACKWARDS':
        $this.options.status = 'move';
        _private.moveBackwards();
        _private.checkKickBack();
      break;

      case 'TURN_LEFT':
        $this.options.status = 'turn';
        _private.turnLeft();
      break;

      case 'TURN_RIGHT':
        $this.options.status = 'turn';
        _private.turnRight();
      break;

      case 'LOAD_CANNON':
        $this.options.status = 'loading';
        _private.loadCannon();
      break;

      case 'FIRE_CANNON':
        $this.options.status = 'fire';
        _private.cannonFireHandling();
      break;

      case 'SHIP_DAMAGE':
        $this.options.status = 'damage';
        _private.shipDamage();
      break;

      case 'ACTION':
        $this.options.status = 'action';
        // take something, activate etc, etc, this is the key
        // todo: _private.action();
      break;
    }

    // If Finish Order is reached
    if($this.options.status == 'finish') {
      $this.options.current_order = 'none';
      $this.options.current_order_parameter = {};
      $this.options.status = 'idle';
      $this.options.kickback = false;
      $this.resetAnimationSteps();
      $this.recalcTiledPosition();
    }

    // Render HUD
    if($this.options.status != 'killed') {
      $this.renderHUD();
    }
  };

  /**
   * setOrder
   * @description
   * This sets the current order if the state allows it
   *
   * @param strOrder      The GameObject Order that has to be executet
   * @param objParameter  The Parameters for the Order
   * @return void
   */
  this.setOrder = function(strOrder, objParameter) {
    // No orders if ship is killed or sinking
    if($this.options.status == 'killed' || $this.options.status == 'sinking') {
      return;
    }

    // Set Order if state is ready for new orders
    if($this.options.current_order == 'none' && $this.options.status == 'idle') {
      $this.options.status = 'waiting';
      $this.options.current_order = strOrder;
      if(typeof(objParameter) != 'undefined') {
        $this.options.current_order_parameter = objParameter;
      }
    }
  };

  /**
   * moveForwards
   * @description
   * This Moves the Ship one Tile Forward
   *
   * @param void
   * @return void
   */
  _private.moveForwards = function() {
    // Play MovementSound
    var numMoveCounter = $this.options.animation_steps['moveSouth'];
    numMoveCounter += $this.options.animation_steps['moveNorth'];
    numMoveCounter += $this.options.animation_steps['moveEast'];
    numMoveCounter += $this.options.animation_steps['moveWest'];
    if(numMoveCounter == 0) {
      $this.options.sfx.ship_move.play();
    }

    // Do Direction Movement
    if($this.options.direction == 'N') {
      _private.moveNorth();
    }
    if($this.options.direction == 'NE') {
      _private.moveNorth();
      _private.moveEast();
    }
    if($this.options.direction == 'E') {
      _private.moveEast();
    }
    if($this.options.direction == 'SE') {
      _private.moveSouth();
      _private.moveEast();
    }
    if($this.options.direction == 'S') {
      _private.moveSouth();
    }
    if($this.options.direction == 'SW') {
      _private.moveSouth();
      _private.moveWest();
    }
    if($this.options.direction == 'W') {
      _private.moveWest();
    }
    if($this.options.direction == 'NW') {
      _private.moveNorth();
      _private.moveWest();
    }
  };

  /**
   * moveBackwards
   * @description
   * This Moves the Ship one Tile Forward
   *
   * @param void
   * @return void
   */
  _private.moveBackwards = function() {
    // Play MovementSound
    var numMoveCounter = $this.options.animation_steps['moveSouth'];
    numMoveCounter += $this.options.animation_steps['moveNorth'];
    numMoveCounter += $this.options.animation_steps['moveEast'];
    numMoveCounter += $this.options.animation_steps['moveWest'];
    if(numMoveCounter == 0) {
      $this.options.sfx.ship_move.play();
    }

    // Do Direction Movement
    if($this.options.direction == 'N') {
      _private.moveSouth();
    }
    if($this.options.direction == 'NE') {
      _private.moveSouth();
      _private.moveWest();
    }
    if($this.options.direction == 'E') {
      _private.moveWest();
    }
    if($this.options.direction == 'SE') {
      _private.moveNorth();
      _private.moveWest();
    }
    if($this.options.direction == 'S') {
      _private.moveNorth();
    }
    if($this.options.direction == 'SW') {
      _private.moveNorth();
      _private.moveEast();
    }
    if($this.options.direction == 'W') {
      _private.moveEast();
    }
    if($this.options.direction == 'NW') {
      _private.moveSouth();
      _private.moveEast();
    }
  };

  /**
   * moveSouth
   * @description
   * This Moves the South Coordinates
   *
   * @param void
   * @return void
   */
  _private.moveSouth = function () {
    var objGameObject = $this.options.gameObject;
    var objCorrection = _private.getCorrectionPosition($this.options.gameObject);
    if(!$this.options.kickback) {
      objGameObject.y++;
    } else {
      objGameObject.y--;
    }
    $this.options.animation_steps['moveSouth']++;
    if(((objGameObject.y - objCorrection.height) / 64) % 1 == 0 && $this.checkAnimationSteps('moveSouth', 50, 80)) {
      $this.options.status = 'finish';
    }
  };

  /**
   * moveNorth
   * @description
   * This Moves the North Coordinates
   *
   * @param void
   * @return void
   */
  _private.moveNorth = function () {
    var objGameObject = $this.options.gameObject;
    var objCorrection = _private.getCorrectionPosition($this.options.gameObject);
    if(!$this.options.kickback) {
      objGameObject.y--;
    } else {
      objGameObject.y++;
    }
    $this.options.animation_steps['moveNorth']++;

    if(((objGameObject.y - objCorrection.height) / 64) % 1 == 0 && $this.checkAnimationSteps('moveNorth', 50, 80)) {
      $this.options.status = 'finish';
    }
  };

  /**
   * moveEast
   * @description
   * This Moves the East Coordinates
   *
   * @param void
   * @return void
   */
  _private.moveEast = function () {
    var objGameObject = $this.options.gameObject;
    var objCorrection = _private.getCorrectionPosition($this.options.gameObject);
    if(!$this.options.kickback) {
      objGameObject.x++;
    } else {
      objGameObject.x--;
    }
    $this.options.animation_steps['moveEast']++;

    if(((objGameObject.x - objCorrection.width) / 64) % 1 == 0 && $this.checkAnimationSteps('moveEast', 50, 80)) {
      $this.options.status = 'finish';
    }
  };

  /**
   * moveWest
   * @description
   * This Moves the West Coordinates
   *
   * @param void
   * @return void
   */
  _private.moveWest = function () {
    var objGameObject = $this.options.gameObject;
    var objCorrection = _private.getCorrectionPosition($this.options.gameObject);
    if(!$this.options.kickback) {
      objGameObject.x--;
    } else {
      objGameObject.x++;
    }
    $this.options.animation_steps['moveWest']++;

    if(((objGameObject.x - objCorrection.width) / 64) % 1 == 0 && $this.checkAnimationSteps('moveWest', 50, 80)) {
      $this.options.status = 'finish';
    }
  };

  /**
   * checkKickBack
   * @description
   * This is checking if the Players Ship is crashing agains a Island
   *
   * @param void
   * @return void
   */
  _private.checkKickBack = function() {
    $this.recalcTiledPosition();
    var objTiledPosition = $this.getTiledPosition();
    // LightWater Layer
    var objTileMapLayer = $this.options.tilemap.getLayer(1);
    var objTileType = objTileMapLayer.getTileFromXY(objTiledPosition.tile_x, objTiledPosition.tile_y);

    // Fortification Layer
    var objFortMapLayer = $this.options.tilemap.getLayer(3);
    var objFortTile = objFortMapLayer.getTileFromXY(objTiledPosition.tile_x, objTiledPosition.tile_y);

    // Check Colision with LightWater
    if(objTileType.index > 0 || objFortTile.index > 0) {
      $this.options.kickback = true;
      $this.options.health -= 25;
    }
  }

  /**
   * turnLeft
   * @description
   * Turn GameObject to Left
   *
   * @param void
   * @return void
   */
  _private.turnLeft = function() {
    var objGameObject = $this.options.gameObject;
    objGameObject.rotation -= 0.01;
    $this.options.animation_steps['turnLeft']++;

    var numDegree = parseInt(Kiwi.Utils.GameMath.radiansToDegrees(objGameObject.rotation));
    if((numDegree / 45) % 1 == 0  && $this.checkAnimationSteps('turnLeft', 75, 80)) {
      $this.options.status = 'finish';
      $this.options.direction = _private.calcNewDirection('left');
    }
  };

  /**
   * turnRight
   * @description
   * Turn GameObject to Right
   *
   * @param void
   * @return void
   */
  _private.turnRight = function() {
    var objGameObject = $this.options.gameObject;
    objGameObject.rotation += 0.01;
    $this.options.animation_steps['turnRight']++;

    var numDegree = parseInt(Kiwi.Utils.GameMath.radiansToDegrees(objGameObject.rotation));
    if((numDegree / 45) % 1 == 0 && $this.checkAnimationSteps('turnRight', 75, 80)) {
      $this.options.status = 'finish';
      $this.options.direction = _private.calcNewDirection('right');
    }
  };

  /**
   * calcNewDirection
   * @description
   * This Method calculates the new direction after turning into a specific direction.
   *
   * @param void
   * @return void
   */
  _private.calcNewDirection = function(strTurnDirection) {
    // Turn to Left
    if($this.options.direction == 'N' && strTurnDirection == 'left') {return 'NW';}
    if($this.options.direction == 'NW' && strTurnDirection == 'left') {return 'W';}
    if($this.options.direction == 'W' && strTurnDirection == 'left') {return 'SW';}
    if($this.options.direction == 'SW' && strTurnDirection == 'left') {return 'S';}
    if($this.options.direction == 'S' && strTurnDirection == 'left') {return 'SE';}
    if($this.options.direction == 'SE' && strTurnDirection == 'left') {return 'E';}
    if($this.options.direction == 'E' && strTurnDirection == 'left') {return 'NE';}
    if($this.options.direction == 'NE' && strTurnDirection == 'left') {return 'N';}

    // Turn to Right
    if($this.options.direction == 'N' && strTurnDirection == 'right') {return 'NE';}
    if($this.options.direction == 'NW' && strTurnDirection == 'right') {return 'N';}
    if($this.options.direction == 'W' && strTurnDirection == 'right') {return 'NW';}
    if($this.options.direction == 'SW' && strTurnDirection == 'right') {return 'W';}
    if($this.options.direction == 'S' && strTurnDirection == 'right') {return 'SW';}
    if($this.options.direction == 'SE' && strTurnDirection == 'right') {return 'S';}
    if($this.options.direction == 'E' && strTurnDirection == 'right') {return 'SE';}
    if($this.options.direction == 'NE' && strTurnDirection == 'right') {return 'E';}
  };

  /**
   * loadCannon
   * @description
   * Loading Cannon for 1 Point
   *
   * @param void
   * @return void
   */
  _private.loadCannon = function() {
    $this.options.animation_steps['loadCannon']++;

    // Load Power Points
    if($this.options.animation_steps['loadCannon'] == 1) {
      if($this.options.cannon_loads < 10) {
        $this.options.cannon_loads++;
      }
    }

    // Loading Cannon Text
    if($this.options.cannon_loads < 10) {
      $this.options.hud.actionText.text = "Cannon +1";
    } else {
      $this.options.hud.actionText.text = "Overload";
    }

    // Finnish Conndition
    if($this.checkAnimationSteps('loadCannon', 80, 80)) {
      $this.options.status = 'finish';
      $this.options.hud.actionText.text = "";
    }
  };

  /**
   * cannonFireHandling
   * @description
   * This handels the Cannon Shooting and decides if Shoot or Error
   *
   * @param void
   * @return void
   */
  _private.cannonFireHandling = function() {
    var numCannonPower = 0;
    if($this.options.animation_steps['fireCannon'] == 0) {
      numCannonPower = $this.options.cannon_loads - $this.options.current_order_parameter.power;
    } else {
      numCannonPower = $this.options.cannon_loads;
    }

    // Error or Shoot
    if(numCannonPower < 0) {
      _private.cannonError();
    } else {
      _private.cannonFire();
    }
  };

  /**
   * cannonError
   * @description
   * Shows the Error Message if the Cannon can not be fired
   *
   * @param void
   * @return void
   */
  _private.cannonError = function() {
    $this.options.animation_steps['fireCannon']++;

    // Show Cannon Error Message
    $this.options.hud.actionText.text = "No Power";

    // Finnish Conndition
    if($this.checkAnimationSteps('fireCannon', 80, 80)) {
      $this.options.status = 'finish';
      $this.options.hud.actionText.text = "";
    }
  };

  /**
   * fireCannon
   * @description
   * Fire the Cannon
   *
   * @param void
   * @return void
   */
  _private.cannonFire = function() {
    $this.options.animation_steps['fireCannon']++;
    var objShip = $this.getGameOject();

    // Cannon Power is Maximal 5
    if($this.options.current_order_parameter.power > 5) {
      $this.options.current_order_parameter.power == 5;
    }

    // Play GunFire Smoke Sprite
    if($this.options.animation_steps['fireCannon'] == 1) {
      $this.options.cannon_loads -= $this.options.current_order_parameter.power;
      var objSmokeCorrection = _private.fireCannonSmokePosition();
      $this.options.sfx.cannon_fire.play();

      var numLeftRight = 0;
      if($this.options.current_order_parameter.cannon == 'left') {
        numLeftRight = 1.5;
      }
      if($this.options.current_order_parameter.cannon == 'right') {
        numLeftRight = 4.5;
      }

      $this.options.smoke.animation.play('fire');
      $this.options.smoke.visible = true;
      $this.options.smoke.rotation = objShip.rotation + numLeftRight;
      $this.options.smoke.y = objShip.y + objSmokeCorrection.height;
      $this.options.smoke.x = objShip.x + objSmokeCorrection.width;
    }
    if($this.options.animation_steps['fireCannon'] > 40) {
      $this.options.smoke.visible = false;
    }

    // Shoot Cannonball
    if($this.options.animation_steps['fireCannon'] == 1) {
      $this.options.bullet.visible = true;

      var objTiledPosition = $this.getTiledPosition();
      $this.options.bullet.x = (objTiledPosition.tile_x * 64) + 26;
      $this.options.bullet.y = (objTiledPosition.tile_y * 64) + 26;
    } else {
      _private.fireCannonBullet();
      _private.scalleCannonBullet();
    }

    // Finnish Conndition
    if($this.checkAnimationSteps('fireCannon', 100, 100)) {
      // Set hit Calculation Object
      if($this.options.bullet.visible) {
        $this.options.cannon_fire.fired = true;
        $this.options.cannon_fire.pos_x = parseInt($this.options.bullet.x / 64);
        $this.options.cannon_fire.pos_y = parseInt($this.options.bullet.y / 64);
      }

      $this.options.bullet.visible = false;
      $this.options.status = 'finish';
    }
  };

  /**
   * resetHitCalculation
   * @description
   * This is reseting the Hit Calculation Object
   *
   * @param void
   * @return void
   */
  this.resetHitCalculation = function() {
    $this.options.cannon_fire.fired = false;
    $this.options.cannon_fire.pos_x = 0;
    $this.options.cannon_fire.pos_y = 0;
  };

  /**
   * fireCannonSmokePosition
   * @description
   * This is the Correction Position for the CannonSmoke Sprite
   *
   * @param void
   * @return objCorrection  This is the Correction Position Height and Width
   */
  _private.fireCannonSmokePosition = function() {
    var objCorrection = {};
    var strCode = $this.options.direction + ':' + $this.options.current_order_parameter.cannon;

    if(strCode == 'S:left' || strCode == 'N:right') {
      objCorrection = {'width': 40, 'height': -10};
    }
    if(strCode == 'SE:left' || strCode == 'NW:right') {
      objCorrection = {'width': 25, 'height': -60};
    }
    if(strCode == 'E:left' || strCode == 'W:right') {
      objCorrection = {'width': -30, 'height': -75};
    }
    if(strCode == 'NE:left' || strCode == 'SW:right') {
      objCorrection = {'width': -90, 'height': -60};
    }
    if(strCode == 'N:left' || strCode == 'S:right') {
      objCorrection = {'width': -120, 'height': -10};
    }
    if(strCode == 'SW:left' || strCode == 'NE:right') {
      objCorrection = {'width': 35, 'height': 55};
    }
    if(strCode == 'W:left' || strCode == 'E:right') {
      objCorrection = {'width': -25, 'height': 75};
    }
    if(strCode == 'NW:left' || strCode == 'SE:right') {
      objCorrection = {'width': -90, 'height': 60};
    }

    return objCorrection;
  };

  /**
   * fireCannonBullet
   * @description
   * This is the Bullet Fire animation
   *
   * @param void
   * @return void
   */
  _private.fireCannonBullet = function() {
    var strCode = $this.options.direction + ':' + $this.options.current_order_parameter.cannon;
    var numSpeed = ($this.options.current_order_parameter.power * 64) / 100;

    if(strCode == 'S:left' || strCode == 'N:right') {
      $this.options.bullet.x += numSpeed;
    }
    if(strCode == 'SE:left' || strCode == 'NW:right') {
      $this.options.bullet.x += numSpeed;
      $this.options.bullet.y -= numSpeed;
    }
    if(strCode == 'E:left' || strCode == 'W:right') {
      $this.options.bullet.y -= numSpeed;
    }
    if(strCode == 'NE:left' || strCode == 'SW:right') {
      $this.options.bullet.x -= numSpeed;
      $this.options.bullet.y -= numSpeed;
    }
    if(strCode == 'N:left' || strCode == 'S:right') {
      $this.options.bullet.x -= numSpeed;
    }
    if(strCode == 'SW:left' || strCode == 'NE:right') {
      $this.options.bullet.x += numSpeed;
      $this.options.bullet.y += numSpeed;
    }
    if(strCode == 'W:left' || strCode == 'E:right') {
      $this.options.bullet.y += numSpeed;
    }
    if(strCode == 'NW:left' || strCode == 'SE:right') {
      $this.options.bullet.x -= numSpeed;
      $this.options.bullet.y += numSpeed;
    }
  };

  /**
   * scalleCannonBullet
   * @description
   * This is the Bullet Scalle
   *
   * @param void
   * @return void
   */
  _private.scalleCannonBullet = function() {
    var numSpeed = ($this.options.current_order_parameter.power * 64) / 100;
    var numSteps = $this.options.animation_steps['fireCannon'];

    // Scalle Up
    if($this.checkAnimationSteps('fireCannon', 0, 45)) {
      $this.options.bullet.scaleToHeight(12 + (numSteps * 0.5));
      $this.options.bullet.scaleToWidth(12 + (numSteps * 0.5));
    }

    // Scalle Down
    if($this.checkAnimationSteps('fireCannon', 55, 100)) {
      $this.options.bullet.scaleToHeight(12 + (45 * 0.5) - ((numSteps-45) * 0.5));
      $this.options.bullet.scaleToWidth(12 + (45 * 0.5) - ((numSteps-45) * 0.5));
    }
  };

  /**
   * shipDamage
   * @description
   * This Resets the Animation Step counters
   *
   * @param void
   * @return void
   */
  _private.shipDamage = function() {
    $this.options.animation_steps['shipDamage']++;
    var objCorrection = _private.getCorrectionPosition($this.options.explosion);
    var objTiledPosition = $this.getTiledPosition();

    // Calculate Damage
    var numDamageSpeed = $this.options.current_order_parameter.dmg / 100;
    $this.options.health -= numDamageSpeed;

    // Load Power Points
    if($this.options.animation_steps['shipDamage'] == 1) {
        // Explosion Animation
        $this.options.explosion.y = objTiledPosition.tile_y * 64;
        $this.options.explosion.x = objTiledPosition.tile_x * 64;
        $this.options.explosion.animation.play('explode');
        $this.options.explosion.visible = true;
        $this.options.sfx.ship_damage.play();
    }

    // Finnish Conndition
    if($this.checkAnimationSteps('shipDamage', 100, 100)) {
      $this.options.status = 'finish';
      $this.options.explosion.visible = false;
    }
  };

  /**
   * resetAnimationSteps
   * @description
   * This Resets the Animation Step counters
   *
   * @param void
   * @return void
   */
  $this.resetAnimationSteps = function() {
    for(var strIndex in $this.options.animation_steps) {
      $this.options.animation_steps[strIndex] = 0;
    }
  };

  /**
   * resetAllSounds
   * @description
   * This Resets All Sounds
   *
   * @param void
   * @return void
   */
  $this.resetAllSounds = function() {
    for(var strIndex in $this.options.sfx) {
      $this.options.sfx[strIndex].stop();
    }
  };

  /**
   * checkAnimationSteps
   * @description
   * This checks if the Number of Animation Steps are plausible
   *
   * @param strIndex    Name of the step index
   * @param numFrom     From Number
   * @param numTo       To Number
   * @return bool       True if plausible, False if not
   */
  $this.checkAnimationSteps = function(strIndex, numFrom, numTo) {
    if(typeof($this.options.animation_steps[strIndex]) != 'undefined') {
      if($this.options.animation_steps[strIndex] >= numFrom && $this.options.animation_steps[strIndex] <= numTo) {
        return true;
      }
    }
    return false;
  };

  /**
   * getTiledPosition
   * @description
   * This get the Position in TiledMap coordinates
   *
   * @return objCoords
   */
  $this.getTiledPosition = function() {
    return $this.options.position;
  };

  /**
   * setTiledPositionInTiles
   * @description
   * This sets the Position by TileMap coordinates
   *
   * @param numX    X Coordinate in Tiles
   * @param numY    Y Coordinate in Tiles
   * @return void
   */
  $this.setTiledPositionInTiles = function(numX, numY) {
    var objShip = $this.options.gameObject;
    var objCorrection = _private.getCorrectionPosition($this.options.gameObject);
    $this.options.position.tile_x = numX;
    $this.options.position.tile_y = numY;
    $this.options.gameObject.x = (numX - 1) * 64 + objCorrection.width;
    $this.options.gameObject.y = (numY - 1) * 64 + objCorrection.height;
  };

  /**
   * recalcTiledPosition
   * @description
   * Everytime the Ship moves you should call this to recalculate the Position in tiles
   *
   * @param numX    X Coordinate in Tiles
   * @param numY    Y Coordinate in Tiles
   * @return void
   */
  $this.recalcTiledPosition = function() {
    var objShip = $this.options.gameObject;
    $this.options.position.tile_x = Math.round((objShip.x + (objShip.width / 2) + 32) / 64) - 1;
    $this.options.position.tile_y = Math.round((objShip.y + (objShip.height / 2) + 32) / 64) - 1;
  };

  /**
   * getCorrectionPosition
   * @description
   * This is the Correction Code for Sprites on the Tilemap
   *
   * @param objCorrectionObject   The Object wich has to be Corrected
   * @return objCorrection        This is the Correction Coordinates for Height and Width
   */
  _private.getCorrectionPosition = function(objCorrectionObject) {
    var numTileWidth = 64;
    var numTileHeight = 64;

    var objCorrection = {
      width: (numTileWidth - objCorrectionObject.width) / 2,
      height: (numTileHeight - objCorrectionObject.height) / 2
    }

    return objCorrection;
  };

  /**
   * renderHUD
   * @description
   * Renders The HUD on every Update
   *
   * @param void
   * @return void
   */
  $this.renderHUD = function() {
    var objShip = $this.getGameOject();

    // Render Camera Position
    var numTransformX = -1 * objShip.x + 640 * 0.5 - objShip.width / 2;
    var numTransformY = -1 * objShip.y + 640 * 0.5 - objShip.height / 2;
    if($this.options.camera_focus) {
      _game.cameras.defaultCamera.transform.x = numTransformX;
    	_game.cameras.defaultCamera.transform.y = numTransformY;
    } else {
      numTransformX = _game.cameras.defaultCamera.transform.x;
      numTransformY = _game.cameras.defaultCamera.transform.y;
    }

    // Render Player Name
    $this.options.hud.playerText.x = objShip.x + numTransformX - 1;
    $this.options.hud.playerText.y = objShip.y + numTransformY - 22;

    // Render Action Text
    var numAnimation = $this.options.animation_steps.loadCannon + $this.options.animation_steps.fireCannon;
    $this.options.hud.actionText.x = objShip.x + numTransformX;
    $this.options.hud.actionText.y = objShip.y + numTransformY + 60 - numAnimation;
    $this.options.hud.actionText.style.opacity = 1 - numAnimation / 100;

    // Render HealthBar
    $this.options.hud.healthBar.bg.x = objShip.x + numTransformX - 1;
    $this.options.hud.healthBar.bg.y = objShip.y + numTransformY - 1
    $this.options.hud.healthBar.bar.x = objShip.x + numTransformX;
    $this.options.hud.healthBar.bar.y = objShip.y + numTransformY
    $this.options.hud.healthBar.bar.counter.current = $this.options.health;

    // Render CannonBar
    $this.options.hud.cannonBar.bg.x = objShip.x + numTransformX - 1;
    $this.options.hud.cannonBar.bg.y = objShip.y + numTransformY + 9;
    $this.options.hud.cannonBar.bar.x = objShip.x + numTransformX;
    $this.options.hud.cannonBar.bar.y = objShip.y + numTransformY + 10;
    $this.options.hud.cannonBar.bar.counter.current = $this.options.cannon_loads;

    // Rendering Ship Damage
    if($this.options.health > 75) {
      $this.options.gameObject.animation.switchTo($this.options.ship_animation.ship_100);
    }
    if($this.options.health <= 75) {
      $this.options.gameObject.animation.switchTo($this.options.ship_animation.ship_75);
    }
    if($this.options.health <= 30) {
      $this.options.gameObject.animation.switchTo($this.options.ship_animation.ship_30);
    }
    if($this.options.health <= 0) {
      $this.options.gameObject.animation.switchTo($this.options.ship_animation.ship_0);
    }

    // Render Sinking Ship
    if($this.options.health <= 0) {
      if($this.options.gameObject.alpha == 1) {
        $this.resetAllSounds();
        $this.options.sfx.ship_kill.play();
      }

      $this.options.status = 'sinking';
      $this.options.gameObject.alpha -= 0.005;
      $this.options.hud.playerText.y += (1 - $this.options.gameObject.alpha) * 90;
      $this.options.hud.playerText.style.opacity = $this.options.gameObject.alpha;
      $this.options.hud.healthBar.bg.style.display = 'none';
      $this.options.hud.healthBar.bar.style.display = 'none';
      $this.options.hud.cannonBar.bg.style.display = 'none';
      $this.options.hud.cannonBar.bar.style.display = 'none';

      if($this.options.gameObject.alpha >= 0.5) {
        $this.options.gameObject.scaleToWidth($this.options.gameObject.alpha * $this.options.gameObject.width);
        $this.options.gameObject.scaleToHeight($this.options.gameObject.alpha * $this.options.gameObject.height);
      }
    }

    // Render Killed Ship
    if($this.options.gameObject.alpha <= 0.2) {
      $this.options.status = 'killed';
    }
  };

  /**
   * getGameOject
   * @description
   * This returns the KiwiGameObject
   *
   * @param void
   * @return Kiwi.GameObject
   */
  $this.getGameOject = function() {
    return $this.options.gameObject;
  };

  /**
   * getId
   * @description
   * This Returns the UUID of the GameObject
   *
   * @param void
   * @return Kiwi.GameObject
   */
  $this.getId = function() {
    return $this.options.id;
  };

  /**
   * isIdle
   * @description
   * This returns True if the Animation is idle
   *
   * @param void
   * @return Kiwi.GameObject
   */
  $this.isIdle = function() {
      if($this.options.status == 'idle') {
        return true;
      }
      return false;
  };

  // Constructor Call
  $this.init();
};
