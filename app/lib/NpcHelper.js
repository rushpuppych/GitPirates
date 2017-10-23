/**
 * NpcHelper
 * @description
 * Generic Jquery Helper Class
 */
var NpcHelper = function() {
  var $this = this;
  var _private = {};

  // Helper System Variables
  this.options = {

  };

  /**
   * Constructor
   */
  this.init = function(objMapConfig, objNpcPlayer) {

  };

  /**
   * getNpcCommand
   * @description
   * This is getting the NPC Next Step Command
   *
   * @param objMapConfig    This is The Map Config Object
   * @param objNpcPlayer    This is the NPC Player Object
   * @return strNextStep    This is the Command for the NPC Player ship
   */
  this.getNpcCommand = function(objMapConfig, objNpcPlayer) {
    // Dummy Path Finding
    var strNextStep = $this.dummyPathFinder(objMapConfig, objNpcPlayer);

    // WarMode
    // TODO: Check radius and attack

    // Get Waiting Moves
    if(strNextStep == '' && objNpcPlayer.options.cannon_loads < 10) {
      strNextStep = 'LOAD_CANNON';
    }

    return strNextStep;
  };

  /**
   * dummyPathFinder
   * @description
   * This calculates the next Tile for the NPC Ship
   *
   * @param objMapConfig    This is The Map Config Object
   * @param objNpcPlayer    This is the NPC Player Object
   * @return strNextStep    This is the Next Step Command
   */
  this.dummyPathFinder = function(objMapConfig, objNpcPlayer) {
    var numPlayerX = objNpcPlayer.options.position.tile_x;
    var numPlayerY = objNpcPlayer.options.position.tile_y;
    var numTargetX = objMapConfig.player.pos_x;
    var numTargetY = objMapConfig.player.pos_y;

    // Get Direction
    var strDirection = $this.getDirection(numPlayerX, numPlayerY, numTargetX, numTargetY);

    // Get Next Coordinate
    var strNextStep = '';
    if(strDirection == objNpcPlayer.options.direction) {
      if($this.checkMoveForwards(objMapConfig, objNpcPlayer, strDirection)) {
        strNextStep = 'MOVE_FORWARDS';
      }
    } else {
      strNextStep = $this.turnShip(strDirection, objNpcPlayer);
    }

    return strNextStep;
  };

  /**
   * getDirection
   * @description
   * This gives the Direction of the Target Object
   *
   * @param numPlayerX      This is The PlayerX
   * @param numPlayerY      This is The PlayerY
   * @param numTargetX      This is The TargetX
   * @param numTargetY      This is The TargetY
   * @param objNpcPlayer    This is the NPC Player Object
   * @return strDirection   This is the Direction of the Target
   */
  this.getDirection = function(numPlayerX, numPlayerY, numTargetX, numTargetY) {
    var strDirection = '';
    if(numTargetY < numPlayerY) {
      strDirection = 'N';
    }
    if(numTargetY > numPlayerY) {
      strDirection = 'S';
    }
    if(numTargetX < numPlayerX) {
      strDirection += 'W';
    }
    if(numTargetX > numPlayerX) {
      strDirection += 'E';
    }
    return strDirection;
  };

  /**
   * turnShip
   * @description
   * This calculates the Turn Command
   *
   * @param objMapConfig    This is The Map Config Object
   * @param objNpcPlayer    This is the NPC Player Object
   * @return strTurn         This is the Next Step Command
   */
  this.turnShip = function(strDirection, objNpcPlayer) {
    // Simplyfi Direction
    var strNpcDirection = objNpcPlayer.options.direction;

    // Get Direction
    var strTurn = 'TURN_RIGHT';
    if(strNpcDirection == 'N' && strDirection == 'NE') {strTurn = 'TURN_RIGHT';}
    if(strNpcDirection == 'N' && strDirection == 'NW') {strTurn = 'TURN_LEFT';}

    if(strNpcDirection == 'NE' && strDirection == 'E') {strTurn = 'TURN_RIGHT';}
    if(strNpcDirection == 'NE' && strDirection == 'N') {strTurn = 'TURN_LEFT';}

    if(strNpcDirection == 'E' && strDirection == 'SE') {strTurn = 'TURN_RIGHT';}
    if(strNpcDirection == 'E' && strDirection == 'NE') {strTurn = 'TURN_LEFT';}

    if(strNpcDirection == 'SE' && strDirection == 'S') {strTurn = 'TURN_RIGHT';}
    if(strNpcDirection == 'SE' && strDirection == 'E') {strTurn = 'TURN_LEFT';}

    if(strNpcDirection == 'S' && strDirection == 'SW') {strTurn = 'TURN_RIGHT';}
    if(strNpcDirection == 'S' && strDirection == 'SE') {strTurn = 'TURN_LEFT';}

    if(strNpcDirection == 'SW' && strDirection == 'W') {strTurn = 'TURN_RIGHT';}
    if(strNpcDirection == 'SW' && strDirection == 'S') {strTurn = 'TURN_LEFT';}

    if(strNpcDirection == 'W' && strDirection == 'NW') {strTurn = 'TURN_RIGHT';}
    if(strNpcDirection == 'W' && strDirection == 'SW') {strTurn = 'TURN_LEFT';}

    if(strNpcDirection == 'NW' && strDirection == 'N') {strTurn = 'TURN_RIGHT';}
    if(strNpcDirection == 'NW' && strDirection == 'W') {strTurn = 'TURN_LEFT';}

    return strTurn;
  }

  /**
   * getDirectionNextCoords
   * @description
   * Get The Next Direction
   *
   * @param objMapConfig    This is The Map Config Object
   * @param objNpcPlayer    This is the NPC Player Object
   * @return boolRouteFree  This is true it the route is free
   */
  this.checkMoveForwards = function(objMapConfig, objNpcPlayer, strDirection) {
    var numPlayerX = objNpcPlayer.options.position.tile_x;
    var numPlayerY = objNpcPlayer.options.position.tile_y;
    var objMap = objMapConfig.map;
    var boolRouteFree = false;

    if(strDirection == 'N') {
      if(objMap[numPlayerX + 0][numPlayerY - 1] == 0) {
        boolRouteFree = true;
      }
    }
    if(strDirection == 'NE') {
      if(objMap[numPlayerX + 1][numPlayerY - 1] == 0) {
        boolRouteFree = true;
      }
    }
    if(strDirection == 'E') {
      if(objMap[numPlayerX + 1][numPlayerY - 0] == 0) {
        boolRouteFree = true;
      }
    }
    if(strDirection == 'SE') {
      if(objMap[numPlayerX + 1][numPlayerY + 1] == 0) {
        boolRouteFree = true;
      }
    }
    if(strDirection == 'S') {
      if(objMap[numPlayerX - 0][numPlayerY + 1] == 0) {
        boolRouteFree = true;
      }
    }
    if(strDirection == 'SW') {
      if(objMap[numPlayerX - 1][numPlayerY + 1] == 0) {
        boolRouteFree = true;
      }
    }
    if(strDirection == 'W') {
      if(objMap[numPlayerX - 1][numPlayerY - 0] == 0) {
        boolRouteFree = true;
      }
    }
    if(strDirection == 'NW') {
      if(objMap[numPlayerX - 1][numPlayerY - 1] == 0) {
        boolRouteFree = true;
      }
    }
    return boolRouteFree;
  };

  // Constructor Call
  $this.init();
};
