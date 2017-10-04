/**
 * App
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var App = function(options) {
  var $this = this;
  var _private = {};

  // CodePirate System Variables
  this.options = $.extend({
    game: {},
    states: []
  }, options);

  /**
   * Constructor
   */
  this.init = function() {
    // Register States
    _private.registerState('PlayGameState', new PlayGameState());

    // Create New Game
    _private.createGame();

    // Run Game
    $this.options.game.states.switchState("PlayGameState");
  };

  /**
   * registerState
   * @description
   * This Method is registering new Kiwi GameEngine States.
   * This are the States wich the CreateGame Method uses to initalize the Game.
   *
   * @param strStateKey   This is the Unique State Key wich is used to get a specific State
   * @param objState      This is the Kiwi State Object
   * @return void
   */
  _private.registerState = function(strStateKey, objState) {
    $this.options.states[strStateKey] = objState;
  }

  /**
   * createGame
   * @description
   * This is the Main Game Object Creation Method. It is creating a new Kiwi
   * GameEngine Object.
   *
   * @param void
   * @return void
   */
  _private.createGame = function() {
    // Create Game
    var objOptions = {
    	renderer: Kiwi.RENDERER_WEBGL,
    	width: 800,
    	height: 600
    }
    var objGame = new Kiwi.Game('CodePirate', 'CodePirate', null, objOptions);

    // Add States
    for(var strKey in $this.options.states) {
        var objState = $this.options.states[strKey];
        objGame.states.addState(objState.getState());
    }

    // Set Main Game Object
    $this.options.game = objGame;
  };

  // Constructor Call
  $this.init();
};
