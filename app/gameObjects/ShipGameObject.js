/**
 * ShipGameObject
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var ShipGameObject = function(state, options) {
  var $this = this;
  var _private = {};
  var _state = state;
  var helper = new Helper();

  // CodePirate System Variables
  this.options = $.extend({
    id: 'severin', //helper.uuid(),
    gameObject: {},
    status: 'idle',
    direction: 'S',
    current_order: 'none'
  }, options);

  /**
   * Constructor
   */
  this.init = function() {
    // Set UniqueId

    // Create Ship Object
    var objShip = new Kiwi.GameObjects.Sprite(_state, _state.textures.ship_01, 1, 1);
    objShip.x = 64;
    objShip.y = 192;
    objShip.rotation = 0;
    $this.options.gameObject = objShip;

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
    }

    // If Finish Order is reached
    if($this.options.status == 'finish') {
      $this.options.current_order = 'none';
      $this.options.status = 'idle';
    }
  };

  /**
   * setOrder
   * @description
   * This sets the current order if the state allows it
   *
   * @param strOrder    The GameObject Order that has to be executet
   * @return void
   */
  this.setOrder = function(strOrder) {
    if($this.options.current_order == 'none' && $this.options.status == 'idle') {
      $this.options.current_order = strOrder;
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
      _private.moveNorth(1);
    }
    if($this.options.direction == 'NE') {
      _private.moveNorth(0.5);
      _private.moveEast(0.5);
    }
    if($this.options.direction == 'E') {
      _private.moveEast(1);
    }
    if($this.options.direction == 'SE') {
      _private.moveSouth(0.5);
      _private.moveEast(0.5);
    }
    if($this.options.direction == 'S') {
      _private.moveSouth(1);
    }
    if($this.options.direction == 'SW') {
      _private.moveSouth(0.5);
      _private.moveWest(0.5);
    }
    if($this.options.direction == 'W') {
      _private.moveWest();
    }
    if($this.options.direction == 'NW') {
      _private.moveNorth(0.5);
      _private.moveWest(0.5);
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
      _private.moveSouth(1);
    }
    if($this.options.direction == 'NE') {
      _private.moveSouth(0.5);
      _private.moveWest(0.5);
    }
    if($this.options.direction == 'E') {
      _private.moveWest(1);
    }
    if($this.options.direction == 'SE') {
      _private.moveNorth(0.5);
      _private.moveWest(0.5);
    }
    if($this.options.direction == 'S') {
      _private.moveNorth(1);
    }
    if($this.options.direction == 'SW') {
      _private.moveNorth(0.5);
      _private.moveEast(0.5);
    }
    if($this.options.direction == 'W') {
      _private.moveEast(1);
    }
    if($this.options.direction == 'NW') {
      _private.moveSouth(0.5);
      _private.moveEast(0.5);
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
  _private.moveSouth = function (numStep) {
    var objGameObject = $this.options.gameObject;
    objGameObject.y += 1; //numStep;
    if((objGameObject.y / 64) % 1 == 0) {
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
  _private.moveNorth = function (numStep) {
    var objGameObject = $this.options.gameObject;
    objGameObject.y -= 1; //numStep;
    if((objGameObject.y / 64) % 1 == 0) {
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
  _private.moveEast = function (numStep) {
    var objGameObject = $this.options.gameObject;
    objGameObject.x += 1; //numStep;
    if((objGameObject.x / 64) % 1 == 0) {
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
  _private.moveWest = function (numStep) {
    var objGameObject = $this.options.gameObject;
    objGameObject.x -= 1; //numStep;
    if((objGameObject.x / 64) % 1 == 0) {
      $this.options.status = 'finish';
    }
  };

  /**
   * turnLeft
   * @description
   * Turn GameObject to Right Wichtig beim umrechnen kann es sein das die Grad Anzahl nach einem schritt noch
   * exakt die selbe wie zuvor ist. Dann darf nicht abgebrochen werden sondern muss weiter gedreht werden.
   *
   * @param void
   * @return void
   */
  _private.turnLeft = function() {
    var objGameObject = $this.options.gameObject;
    var numOldDegrees = parseInt(Kiwi.Utils.GameMath.radiansToDegrees(objGameObject.rotation));

    objGameObject.rotation -= 0.01;
    var numDegree = parseInt(Kiwi.Utils.GameMath.radiansToDegrees(objGameObject.rotation));
    if((numDegree / 45) % 1 == 0 && numOldDegrees != numDegree) {
      $this.options.status = 'finish';
      $this.options.direction = _private.calcNewDirection('left');
    }
  };

  /**
   * turnRight
   * @description
   * Turn GameObject to Right Wichtig beim umrechnen kann es sein das die Grad Anzahl nach einem schritt noch
   * exakt die selbe wie zuvor ist. Dann darf nicht abgebrochen werden sondern muss weiter gedreht werden.
   *
   * @param void
   * @return void
   */
  _private.turnRight = function() {
    var objGameObject = $this.options.gameObject;
    var numOldDegrees = parseInt(Kiwi.Utils.GameMath.radiansToDegrees(objGameObject.rotation));

    objGameObject.rotation += 0.01;
    var numDegree = parseInt(Kiwi.Utils.GameMath.radiansToDegrees(objGameObject.rotation));
    if((numDegree / 45) % 1 == 0 && numOldDegrees != numDegree) {
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
