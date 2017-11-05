/**
 * ConfigShipState
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var MissionSelectState = function(game, app, options) {
  var $this = this;
  var _app = app;
  var _private = {};
  var _game = game;
  var _state = new Kiwi.State('MissionSelectState');
  var helper = new Helper();

  // CodePirate System Variables
  this.options = $.extend({
    state: {},
    ship_config: '',
    ship: {},
    gui: {
      backbtn: {},
      deletebtn: {},
      configbtn: {},
      singleplayerbtn: {},
      multiplayerbtn: {}
    },
    click: {}
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
    // Load All Images
    _state.addImage('logo_big', 'app/assets/images/gui/logo_big.png', true, 631, 155);
    _state.addImage('border_all', 'app/assets/images/gui/border_all.png', true, 1024, 640);
    _state.addImage('wood', 'app/assets/images/gui/wood.png', true, 128, 128, 0, 0);
    _state.addImage('banner_menu', 'app/assets/images/gui/banner_menu.png', true, 800, 346);
    _state.addImage('multiplayer', 'app/assets/images/gui/multiplayer.png', true, 256, 256);
    _state.addImage('singleplayer', 'app/assets/images/gui/singleplayer.png', true, 126, 126);
    _state.addSpriteSheet('ships', 'app/assets/images/sprites/ships.png', 76, 123);
    _state.addSpriteSheet('back_button', 'app/assets/images/gui/back_button.png', 204, 54);
    _state.addSpriteSheet('delete_button', 'app/assets/images/gui/delete_button.png', 204, 54);
    _state.addSpriteSheet('config_button', 'app/assets/images/gui/config_button.png', 204, 54);
    _state.addSpriteSheet('singleplay_button', 'app/assets/images/gui/singleplay_button.png', 204, 54);
    _state.addSpriteSheet('multiplay_button', 'app/assets/images/gui/multiplay_button.png', 204, 54);
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
    // Reset Button states
    $this.resetBtn();

    // Create Background Image
    for(var numX = 0; numX < 8; numX++) {
      for(var numY = 0; numY < 5; numY++) {
        var objBackground = new Kiwi.GameObjects.Sprite(_state, 'wood');
        objBackground.x = numX * 128;
        objBackground.y = numY * 128;
        _state.addChild(objBackground);
      }
    }

    // Create Logo
    var objLogo = new Kiwi.GameObjects.Sprite(_state, 'logo_big');
    objLogo.x = 190;
    objLogo.y = 25;
    _state.addChild(objLogo);

    // Create Border
    var objBorderAll = new Kiwi.GameObjects.Sprite(_state, 'border_all');
    objBorderAll.x = 0;
    objBorderAll.y = 0;
    _state.addChild(objBorderAll);

    // Create Banner Menu
    var objBannerMenu = new Kiwi.GameObjects.Sprite(_state, 'banner_menu');
    objBannerMenu.x = 110;
    objBannerMenu.y = 180;
    _state.addChild(objBannerMenu);

    // Selection Title
    var objSelectionTitle = new Kiwi.HUD.Widget.TextField (_game, 'Select Game Mode', 425, 205);
    objSelectionTitle.style.fontFamily = "Germania One";
    objSelectionTitle.style.fontSize = "26px";
    objSelectionTitle.style.textAlign = "center";
    objSelectionTitle.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objSelectionTitle);

    // Create Singleplayer Icon
    var objSinglePlayer = new Kiwi.GameObjects.Sprite(_state, 'singleplayer');
    objSinglePlayer.x = 290;
    objSinglePlayer.y = 270;
    _state.addChild(objSinglePlayer);

    // Create Multiplayer Icon
    var objMultiPlayer = new Kiwi.GameObjects.Sprite(_state, 'multiplayer');
    objMultiPlayer.x = 600;
    objMultiPlayer.y = 270;
    _state.addChild(objMultiPlayer);

    // Create Back Button
    var objBackBtn = new Kiwi.GameObjects.Sprite(_state, 'back_button');
    objBackBtn.x = 130;
    objBackBtn.y = 540;
    objBackBtn.animation.switchTo(2);
    _state.addChild(objBackBtn);
    $this.options.gui.backbtn = objBackBtn;

    // Create Delete Button
    var objDeleteBtn = new Kiwi.GameObjects.Sprite(_state, 'delete_button');
    objDeleteBtn.x = 410;
    objDeleteBtn.y = 540;
    objDeleteBtn.animation.switchTo(2);
    _state.addChild(objDeleteBtn);
    $this.options.gui.deletebtn = objDeleteBtn;

    // Create Singleplayer Button
    var objSinglePlayerBtn = new Kiwi.GameObjects.Sprite(_state, 'singleplay_button');
    objSinglePlayerBtn.x = 250;
    objSinglePlayerBtn.y = 415;
    objSinglePlayerBtn.animation.switchTo(2);
    _state.addChild(objSinglePlayerBtn);
    $this.options.gui.singleplayerbtn = objSinglePlayerBtn;

    // Create Multiplayer Button
    var objMultiPlayerBtn = new Kiwi.GameObjects.Sprite(_state, 'multiplay_button');
    objMultiPlayerBtn.x = 560;
    objMultiPlayerBtn.y = 415;
    objMultiPlayerBtn.animation.switchTo(2);
    _state.addChild(objMultiPlayerBtn);
    $this.options.gui.multiplayerbtn = objMultiPlayerBtn;

    // Create Config Button
    var objConfigBtn = new Kiwi.GameObjects.Sprite(_state, 'config_button');
    objConfigBtn.x = 690;
    objConfigBtn.y = 540;
    objConfigBtn.animation.switchTo(2);
    _state.addChild(objConfigBtn);
    $this.options.gui.configbtn = objConfigBtn;
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

    // BackBtn Handling
    if(helper.isMouseOverElement($this.options.gui.backbtn)) {
      $this.options.gui.backbtn.animation.switchTo(0);
      if(helper.isMousePressed() && !$this.options.click.backbtn) {
        $this.options.click.backbtn = true;
        _game.huds.defaultHUD.removeAllWidgets();
        $('#FormLayer').html("");
        _game.states.switchState("MainMenuState");
      }
    } else {
      $this.options.gui.backbtn.animation.switchTo(2);
    }

    // DeleteBtn Handling
    if(helper.isMouseOverElement($this.options.gui.deletebtn)) {
      $this.options.gui.deletebtn.animation.switchTo(0);
      if(helper.isMousePressed() && !$this.options.click.deletebtn) {
        $this.options.click.deletebtn = true;
        alert('delete');
      }
    } else {
      $this.options.gui.deletebtn.animation.switchTo(2);
    }

    // ConfigBtn Handling
    if(helper.isMouseOverElement($this.options.gui.configbtn)) {
      $this.options.gui.configbtn.animation.switchTo(0);
      if(helper.isMousePressed() && !$this.options.click.configbtn) {
        $this.options.click.configbtn = true;
        _game.huds.defaultHUD.removeAllWidgets();
        $('#FormLayer').html("");
        _app.getState('ConfigShipState').setShipConfig($this.options.ship_config);
        _game.states.switchState("ConfigShipState");
      }
    } else {
      $this.options.gui.configbtn.animation.switchTo(2);
    }

    // SinglePlayerBtn Handling
    if(helper.isMouseOverElement($this.options.gui.singleplayerbtn)) {
      $this.options.gui.singleplayerbtn.animation.switchTo(0);
      if(helper.isMousePressed() && !$this.options.click.singleplayerbtn) {
        $this.options.click.singleplayerbtn = true;

        // Load SinglePlayer State
        _game.huds.defaultHUD.removeAllWidgets();
        $('#FormLayer').html("");
        _app.getState('SinglePlayerState').setShipConfig($this.options.ship_config, true, '');
        _game.states.switchState("SinglePlayerState");
      }
    } else {
      $this.options.gui.singleplayerbtn.animation.switchTo(2);
    }
  };

  /**
   * setShipConfig
   * @description
   * This is a setter for the ShipConfig File Path
   *
   * @param void
   * @return Kiwi.State
   */
  this.setShipConfig = function(strShipConfig){
    $this.options.ship_config = strShipConfig;
  };

  /**
   * resetBtn
   * @description
   * This resets the Buttons after 1sec
   *
   * @param void
   * @return Kiwi.State
   */
  this.resetBtn = function() {
    // Block Btn
    $this.options.click.backbtn = true;
    $this.options.click.deletebtn = true;
    $this.options.click.configbtn = true;
    $this.options.click.singleplayerbtn = true;

    // Reset Btn
    setTimeout(function() {
      $this.options.click.backbtn = false;
      $this.options.click.deletebtn = false;
      $this.options.click.configbtn = false;
      $this.options.click.singleplayerbtn = false;
    }, 500);
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
