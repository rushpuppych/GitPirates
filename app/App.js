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
    // Create New Game
    _private.createGame();

    // Register States
    _private.registerState('MainMenuState', new MainMenuState($this.options.game, $this));
    _private.registerState('ConfigShipState', new ConfigShipState($this.options.game, $this));
    _private.registerState('MissionSelectState', new MissionSelectState($this.options.game, $this));
    _private.registerState('SinglePlayerState', new SinglePlayerState($this.options.game, $this));
    _private.registerState('MultiPlayerState', new MultiPlayerState($this.options.game, $this));
    _private.registerState('PlayGameState', new PlayGameState($this.options.game, $this));

    // Run Game
    _private.createStates();
    $this.options.game.states.switchState("MainMenuState");
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
    	width: 1024,
    	height: 640
    }
    var objGame = new Kiwi.Game('CodePirate', 'CodePirate', null, objOptions);

    // Set Main Game Object
    $this.options.game = objGame;
  };

  /**
   * createStates
   * @description
   * This is adding the GameStates to the Game Object
   *
   * @param void
   * @return void
   */
  _private.createStates = function() {
    for(var strKey in $this.options.states) {
        var objState = $this.options.states[strKey];
        $this.options.game.states.addState(objState.getState());
    }
  };

  /**
   * getState
   * @description
   * This is returning a speciffic State Controller
   *
   * @param void
   * @return void
   */
  this.getState = function(strStateKey) {
    return $this.options.states[strStateKey];
  };

  // Constructor Call
  $this.init();
};
