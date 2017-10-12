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
    state: {},
    mouse: {x:0,y:0,isDown:false},
    ships: {
      ship_01: {name:"Empty",color:"white",lang:"---",score:"---",qualified:false},
      ship_02: {name:"Empty",color:"white",lang:"---",score:"---",qualified:false},
      ship_03: {name:"Empty",color:"white",lang:"---",score:"---",qualified:false}
    },
    music: {}
  }, options);

  /**
   * Constructor
   */
  this.init = function() {
    // Load Ship Configurations
    const objFs = require('fs-jetpack');
    if(objFs.exists('ship_01.json')) {
      $this.options.ships.ship_01 = JSON.parse(objFs.read('ship_01.json'));
    }
    if(objFs.exists('ship_02.json')) {
      $this.options.ships.ship_02 = JSON.parse(objFs.read('ship_02.json'));
    }
    if(objFs.exists('ship_03.json')) {
      $this.options.ships.ship_03 = JSON.parse(objFs.read('ship_03.json'));
    }

    // Native MousePosition event
    $(document).mousemove(function(event) {
      $this.options.mouse.x = event.pageX;
      $this.options.mouse.y = event.pageY;
    });
    $(document).mousedown(function(event) {
      $this.options.mouse.isDown = true;
    });
    $(document).mouseup(function(event) {
      $this.options.mouse.isDown = false;
    });
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
    _state.addSpriteSheet('ships', 'app/assets/images/sprites/ships.png', 76, 123);

    // Load Music
    _state.addAudio('main_theme', 'app/assets/music/main.mp3');
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
    var objSelectionTitle = new Kiwi.HUD.Widget.TextField (_game, 'Select your ship', 425, 205);
    objSelectionTitle.style.fontFamily = "Germania One";
    objSelectionTitle.style.fontSize = "26px";
    objSelectionTitle.style.textAlign = "center";
    objSelectionTitle.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objSelectionTitle);

    // Create Ships
    $this.options.ships.ship_01 = _private.createShip($this.options.ships.ship_01, 0);
    $this.options.ships.ship_02 = _private.createShip($this.options.ships.ship_02, 200);
    $this.options.ships.ship_03 = _private.createShip($this.options.ships.ship_03, 400);

    // Create Background music
    var objMainThemeMusic = new Kiwi.Sound.Audio(_game, 'main_theme', 0.3, true);
    objMainThemeMusic.play();
    $this.options.music = objMainThemeMusic;
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

    // Handle Ship Selection
    _private.handleShipSelection(260, 240, $this.options.ships.ship_01);
    _private.handleShipSelection(460, 240, $this.options.ships.ship_02);
    _private.handleShipSelection(660, 240, $this.options.ships.ship_03);
  };

  /**
   * createShip
   * @description
   * This creates a Ship on the MainMenu Gui
   *
   * @param objShipOptions    This is the Ship Option Object
   * @param numPosX           This is the Rendering X Position
   * @return objShipOptions   This is the manipulatet ship Options
   */
  _private.createShip = function(objShipOptions, numPosX) {
    objShipOptions.objects = {};
    var numShipFrame = 11;
    if(objShipOptions.color == 'white'){numShipFrame = 11};
    if(objShipOptions.color == 'green'){numShipFrame = 6};
    if(objShipOptions.color == 'blue'){numShipFrame = 13};
    if(objShipOptions.color == 'yellow'){numShipFrame = 20};
    if(objShipOptions.color == 'red'){numShipFrame = 19};

    var objShip = new Kiwi.GameObjects.Sprite(_state, 'ships');
    objShip.x = 265 + numPosX;
    objShip.y = 285;
    objShip.animation.switchTo(numShipFrame);
    objShipOptions.objects.ship = objShip;
    _state.addChild(objShip);

    var objShipName = new Kiwi.HUD.Widget.TextField (_game, objShipOptions.name, 275 + numPosX, 255);
    objShipName.style.fontFamily = "Germania One";
    objShipName.style.fontSize = "20px";
    objShipName.style.textAlign = "center";
    objShipName.style.color = "#848484";
    objShipOptions.objects.name = objShipName;
    _game.huds.defaultHUD.addWidget(objShipName);

    var objShipLang = new Kiwi.HUD.Widget.TextField (_game, 'Lang: ' + objShipOptions.lang, 275 + numPosX, 420);
    objShipLang.style.fontFamily = "Germania One";
    objShipLang.style.fontSize = "14px";
    objShipLang.style.textAlign = "center";
    objShipLang.style.color = "#848484";
    objShipOptions.objects.lang = objShipLang;
    _game.huds.defaultHUD.addWidget(objShipLang);

    var objShipScore = new Kiwi.HUD.Widget.TextField (_game, 'Score: ' + objShipOptions.score, 275 + numPosX, 440);
    objShipScore.style.fontFamily = "Germania One";
    objShipScore.style.fontSize = "14px";
    objShipScore.style.textAlign = "center";
    objShipScore.style.color = "#848484";
    objShipOptions.objects.score = objShipScore;
    _game.huds.defaultHUD.addWidget(objShipScore);

    var strQualification = 'Not Qualified';
    if(objShipOptions.qualified) {
      strQualification = '[ Qualified ]';
    };
    var objShipRanking = new Kiwi.HUD.Widget.TextField (_game, strQualification, 275 + numPosX, 460);
    objShipRanking.style.fontFamily = "Germania One";
    objShipRanking.style.fontSize = "14px";
    objShipRanking.style.textAlign = "center";
    objShipRanking.style.color = "#848484";
    objShipOptions.objects.ranking = objShipRanking;
    _game.huds.defaultHUD.addWidget(objShipRanking);

    return objShipOptions;
  };

  /**
   * isMouseOver
   * @description
   * This Returns true if the mouse cursor is over a speciffic place
   *
   * @param numX        The speciffic place X coordinate
   * @param numY        The speciffic place Y coordinate
   * @param objShip     The Ship Object
   * @return void
   */
  _private.handleShipSelection = function(numX, numY, objShip) {
    if(_private.isMouseOver(numX, numY, 130, 250)) {
      objShip.objects.ship.rotation += 0.05;
      objShip.objects.name.style.color = "#000000";
      objShip.objects.lang.style.color = "#000000";
      objShip.objects.score.style.color = "#000000";
      objShip.objects.ranking.style.color = "#000000";

      // Load Next State
      if(_private.isMousePressed()) {
        if(objShip.color == 'white') {
          _game.huds.defaultHUD.removeAllWidgets();
          _game.states.switchState("ConfigShipState");
        } else {
          _game.huds.defaultHUD.removeAllWidgets();
          _game.states.switchState("MissionSelectState");
        }
      }

    } else {
      objShip.objects.ship.rotation = 0;
      objShip.objects.name.style.color = "#848484";
      objShip.objects.lang.style.color = "#848484";
      objShip.objects.score.style.color = "#848484";
      objShip.objects.ranking.style.color = "#848484";
    }
  };

  /**
   * isMouseOver
   * @description
   * This Returns true if the mouse cursor is over a speciffic place
   *
   * @param numX        The speciffic place X coordinate
   * @param numY        The speciffic place Y coordinate
   * @param numWidth    The speciffic place width
   * @param numHeight   The speciffic place height
   * @return bool       True if over and False if not
   */
  _private.isMouseOver = function(numX, numY, numWidth, numHeight){
    var numMouseX = $this.options.mouse.x;
  	var numMouseY = $this.options.mouse.y;
    if(numMouseX > numX && numMouseX < (numX + numWidth)) {
      if(numMouseY > numY && numMouseY < (numY + numHeight)) {
        return true;
      }
    }
    return false;
  };

  /**
   * isMousePressed
   * @description
   * This returns True if the MouseBtn is pressed
   *
   * @param void
   * @return bool       True if over and False if not
   */
  _private.isMousePressed = function() {
    return $this.options.mouse.isDown;
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
