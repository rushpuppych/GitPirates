/**
 * MainMenuState
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var MainMenuState = function(game, options) {
  var $this = this;
  var _private = {};
  var _game = game;
  var _state = new Kiwi.State('MainMenuState');

  // CodePirate System Variables
  this.options = $.extend({
    state: {}
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
    _state.addImage('logo_big', 'app/assets/images/gui/logo_big.png', true, 631, 155);
    _state.addImage('bg_01', 'app/assets/images/gui/background_01.png', true, 1024, 640, 0, 0);
    _state.addImage('banner_menu', 'app/assets/images/gui/banner_menu.png', true, 800, 346);
    _state.addImage('btn_01', 'app/assets/images/gui/btn_01.png', true, 302, 52);
    _state.addImage('btn_02', 'app/assets/images/gui/btn_02.png', true, 302, 52);
    _state.addImage('btn_03', 'app/assets/images/gui/btn_03.png', true, 302, 52);
    _state.addImage('btn_04', 'app/assets/images/gui/btn_04.png', true, 302, 52);
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
    // Create Background Image
    var objBackground = new Kiwi.GameObjects.Sprite(_state, 'bg_01');
    _state.addChild(objBackground);

    // Create Logo
    var objLogo = new Kiwi.GameObjects.Sprite(_state, 'logo_big');
    objLogo.x = 190;
    objLogo.y = 25;
    _state.addChild(objLogo);

    // Create Banner Menu
    var objBannerMenu = new Kiwi.GameObjects.Sprite(_state, 'banner_menu');
    objBannerMenu.x = 110;
    objBannerMenu.y = 180;
    _state.addChild(objBannerMenu);

    // Create Config Button
    var objConfigBtn = new Kiwi.GameObjects.Sprite(_state, 'btn_01');
    objConfigBtn.x = 360;
    objConfigBtn.y = 220;
    _state.addChild(objConfigBtn);

    // Create Config Button
    var objOfflineBtn = new Kiwi.GameObjects.Sprite(_state, 'btn_02');
    objOfflineBtn.x = 360;
    objOfflineBtn.y = 290;
    _state.addChild(objOfflineBtn);

    // Create Config Button
    var objOnlineBtn = new Kiwi.GameObjects.Sprite(_state, 'btn_03');
    objOnlineBtn.x = 360;
    objOnlineBtn.y = 360;
    _state.addChild(objOnlineBtn);

    // Create Config Button
    var objQuitBtn = new Kiwi.GameObjects.Sprite(_state, 'btn_04');
    objQuitBtn.x = 360;
    objQuitBtn.y = 430;
    _state.addChild(objQuitBtn);
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
