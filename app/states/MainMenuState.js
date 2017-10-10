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

    // Create Ship 1
    var objShip_01 = new Kiwi.GameObjects.Sprite(_state, 'ships');
    objShip_01.x = 265;
    objShip_01.y = 285;
    objShip_01.animation.switchTo(11);
    _state.addChild(objShip_01);

    var objShip_01_name = new Kiwi.HUD.Widget.TextField (_game, 'Empty', 275, 255);
    objShip_01_name.style.fontFamily = "Germania One";
    objShip_01_name.style.fontSize = "20px";
    objShip_01_name.style.textAlign = "center";
    objShip_01_name.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_01_name);

    var objShip_01_language = new Kiwi.HUD.Widget.TextField (_game, 'Lang: ---', 275, 420);
    objShip_01_language.style.fontFamily = "Germania One";
    objShip_01_language.style.fontSize = "14px";
    objShip_01_language.style.textAlign = "center";
    objShip_01_language.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_01_language);

    var objShip_01_score = new Kiwi.HUD.Widget.TextField (_game, 'Score: ---', 275, 440);
    objShip_01_score.style.fontFamily = "Germania One";
    objShip_01_score.style.fontSize = "14px";
    objShip_01_score.style.textAlign = "center";
    objShip_01_score.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_01_score);

    var objShip_01_ranking = new Kiwi.HUD.Widget.TextField (_game, 'Not Qualified', 275, 460);
    objShip_01_ranking.style.fontFamily = "Germania One";
    objShip_01_ranking.style.fontSize = "14px";
    objShip_01_ranking.style.textAlign = "center";
    objShip_01_ranking.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_01_ranking);

    // Create Ship 2
    var objShip_02 = new Kiwi.GameObjects.Sprite(_state, 'ships');
    objShip_02.x = 465;
    objShip_02.y = 285;
    objShip_02.animation.switchTo(11);
    _state.addChild(objShip_02);

    var objShip_02_name = new Kiwi.HUD.Widget.TextField (_game, 'Empty', 475, 255);
    objShip_02_name.style.fontFamily = "Germania One";
    objShip_02_name.style.fontSize = "20px";
    objShip_02_name.style.textAlign = "center";
    objShip_02_name.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_02_name);

    var objShip_02_language = new Kiwi.HUD.Widget.TextField (_game, 'Lang: ---', 475, 420);
    objShip_02_language.style.fontFamily = "Germania One";
    objShip_02_language.style.fontSize = "14px";
    objShip_02_language.style.textAlign = "center";
    objShip_02_language.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_02_language);

    var objShip_02_score = new Kiwi.HUD.Widget.TextField (_game, 'Score: ---', 475, 440);
    objShip_02_score.style.fontFamily = "Germania One";
    objShip_02_score.style.fontSize = "14px";
    objShip_02_score.style.textAlign = "center";
    objShip_02_score.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_02_score);

    var objShip_02_ranking = new Kiwi.HUD.Widget.TextField (_game, 'Not Qualified', 475, 460);
    objShip_02_ranking.style.fontFamily = "Germania One";
    objShip_02_ranking.style.fontSize = "14px";
    objShip_02_ranking.style.textAlign = "center";
    objShip_02_ranking.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_02_ranking);

    // Create Ship 3
    var objShip_03 = new Kiwi.GameObjects.Sprite(_state, 'ships');
    objShip_03.x = 665;
    objShip_03.y = 285;
    objShip_03.animation.switchTo(11);
    _state.addChild(objShip_03);

    var objShip_03_name = new Kiwi.HUD.Widget.TextField (_game, 'Empty', 675, 255);
    objShip_03_name.style.fontFamily = "Germania One";
    objShip_03_name.style.fontSize = "20px";
    objShip_03_name.style.textAlign = "center";
    objShip_03_name.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_03_name);

    var objShip_03_language = new Kiwi.HUD.Widget.TextField (_game, 'Lang: ---', 675, 420);
    objShip_03_language.style.fontFamily = "Germania One";
    objShip_03_language.style.fontSize = "14px";
    objShip_03_language.style.textAlign = "center";
    objShip_03_language.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_03_language);

    var objShip_03_score = new Kiwi.HUD.Widget.TextField (_game, 'Score: ---', 675, 440);
    objShip_03_score.style.fontFamily = "Germania One";
    objShip_03_score.style.fontSize = "14px";
    objShip_03_score.style.textAlign = "center";
    objShip_03_score.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_03_score);

    var objShip_03_ranking = new Kiwi.HUD.Widget.TextField (_game, 'Not Qualified', 675, 460);
    objShip_03_ranking.style.fontFamily = "Germania One";
    objShip_03_ranking.style.fontSize = "14px";
    objShip_03_ranking.style.textAlign = "center";
    objShip_03_ranking.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objShip_03_ranking);

    // Create Event layers
    var strHtml = '';
    strHtml += '<div class="select-ship" style="position: absolute; top: 250px; left: 225px; height: 240px; width: 160px;"></div>';
    strHtml += '<div class="select-ship" style="position: absolute; top: 250px; left: 425px; height: 240px; width: 160px;"></div>';
    strHtml += '<div class="select-ship" style="position: absolute; top: 250px; left: 625px; height: 240px; width: 160px;"></div>';
    $('#EventLayer').html(strHtml);

    // Create Background music
    var objMainThemeMusic = new Kiwi.Sound.Audio(_game, 'main_theme', 0.3, true);
    objMainThemeMusic.play();
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
