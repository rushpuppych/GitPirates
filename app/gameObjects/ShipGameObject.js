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
    gameObject: {},
    status: 'idle',
    direction: 'S',
    current_order: 'none',
    current_order_parameter: {},
    player_name: 'RushPuppy',
    health: 100,
    cannon_loads: 0,
    hud: {
      playerText: {},
      actionText: {},
      healthBar: {},
      cannonBar: {}
    },
    animation_steps: {
      moveNorth: 0,
      moveEast: 0,
      moveSouth: 0,
      moveWest: 0,
      turnLeft: 0,
      turnRight: 0,
      loadCannon: 0,
      fireCannon: 0
    },
    position: {
      tile_x: 1,
      tile_y: 1
    }
  }, options);

  /**
   * Constructor
   */
  this.init = function() {
    // Create Ship Object
    var objShip = new Kiwi.GameObjects.Sprite(_state, _state.textures.ship_01, 1, 1);
    objShip.rotation = 0;
    $this.options.gameObject = objShip;
    $this.setTiledPositionInTiles(2, 4);

    // Smoke SpriteSheet
    var objSmoke = new Kiwi.GameObjects.Sprite(_state, 'smoke');
  	objSmoke.animation.add('fire', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.05);
    objSmoke.visible = false;
  	_state.addChild(objSmoke);
    $this.options.hud.smoke = objSmoke;

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
  };

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
      break;

      case 'MOVE_BACKWARDS':
        $this.options.status = 'move';
        _private.moveBackwards();
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
        _private.fireCannon();
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
      $this.resetAnimationSteps();
      $this.recalcTiledPosition();
    }

    // Render HUD
    $this.renderHUD();
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
    if($this.options.current_order == 'none' && $this.options.status == 'idle') {
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
    objGameObject.y++;
    $this.options.animation_steps['moveSouth']++;
    if((objGameObject.y / 64) % 1 == 0 && $this.checkAnimationSteps('moveSouth', 64, 64)) {
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
    objGameObject.y--;
    $this.options.animation_steps['moveNorth']++;

    if((objGameObject.y / 64) % 1 == 0 && $this.checkAnimationSteps('moveNorth', 64, 64)) {
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
    objGameObject.x++;
    $this.options.animation_steps['moveEast']++;

    if((objGameObject.x / 64) % 1 == 0 && $this.checkAnimationSteps('moveEast', 64, 64)) {
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
    objGameObject.x--;
    $this.options.animation_steps['moveWest']++;

    if((objGameObject.x / 64) % 1 == 0 && $this.checkAnimationSteps('moveWest', 64, 64)) {
      $this.options.status = 'finish';
    }
  };

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

    // Loading Cannon
    if($this.options.cannon_loads < 10) {
      $this.options.hud.actionText.text = "Cannon +1";
    } else {
      $this.options.hud.actionText.text = "Overload";
    }

    // Finnish Conndition
    if($this.checkAnimationSteps('loadCannon', 80, 80)) {
      if($this.options.cannon_loads < 10) {
        $this.options.cannon_loads++;
      }
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
  _private.fireCannon = function() {
    $this.options.animation_steps['fireCannon']++;

    // Play GunFire Smoke Sprite
    if($this.options.animation_steps['fireCannon'] == 1) {
      var objShip = $this.getGameOject();
      $this.options.hud.smoke.animation.play('fire');
      $this.options.hud.smoke.visible = true;
      $this.options.hud.smoke.rotation = 1.5 + objShip.rotation;
      // todo: function for cannonball Position by direction
      $this.options.hud.smoke.y = objShip.y; // + cannonball position
      $this.options.hud.smoke.x = objShip.x; // + cannonball position
    }
    if($this.options.animation_steps['fireCannon'] > 40) {
      $this.options.hud.smoke.visible = false;
    }

    // Shoot Cannonball
    // todo: use Cannonbal Parameters
    // $this.options.current_order_parameter

    // Finnish Conndition
    if($this.checkAnimationSteps('fireCannon', 100, 100)) {
      $this.options.status = 'finish';
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
    $this.options.position.tile_x = numX;
    $this.options.position.tile_y = numY;
    $this.options.gameObject.x = (numX - 1) * 64;
    $this.options.gameObject.y = (numY - 1) * 64;
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
    $this.options.position.tile_x = Math.round($this.options.gameObject.x / 64);
    $this.options.position.tile_y = Math.round($this.options.gameObject.y / 64)
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

    // Render Player Name
    $this.options.hud.playerText.x = objShip.x - 1;
    $this.options.hud.playerText.y = objShip.y - 22;

    // Render Action Text
    var numAnimation = $this.options.animation_steps.loadCannon;
    $this.options.hud.actionText.x = objShip.x;
    $this.options.hud.actionText.y = objShip.y + 60 - numAnimation;
    $this.options.hud.actionText.style.opacity = 1 - numAnimation / 100;

    // Render HealthBar
    $this.options.hud.healthBar.bg.x = objShip.x - 1;
    $this.options.hud.healthBar.bg.y = objShip.y - 1
    $this.options.hud.healthBar.bar.x = objShip.x;
    $this.options.hud.healthBar.bar.y = objShip.y
    $this.options.hud.healthBar.bar.counter.current = $this.options.healt;

    // Render CannonBar
    $this.options.hud.cannonBar.bg.x = objShip.x - 1;
    $this.options.hud.cannonBar.bg.y = objShip.y + 9;
    $this.options.hud.cannonBar.bar.x = objShip.x;
    $this.options.hud.cannonBar.bar.y = objShip.y + 10;
    $this.options.hud.cannonBar.bar.counter.current = $this.options.cannon_loads;
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
