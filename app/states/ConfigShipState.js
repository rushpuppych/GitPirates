/**
 * ConfigShipState
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var ConfigShipState = function(game, options) {
  var $this = this;
  var _private = {};
  var _game = game;
  var _state = new Kiwi.State('ConfigShipState');

  // CodePirate System Variables
  this.options = $.extend({
    state: {},
    music: {},
    ship: {}
  }, options);

  /**
   * Constructor
   */
  this.init = function() {
    $this.eventManager();
  };

  /**
   * EventManager
   */
  this.eventManager = function() {
    $('body').on('change', '#ship_color', function() {
      _private.changeShipColor($(this).val());
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

    // Create Background music
    var objMainThemeMusic = new Kiwi.Sound.Audio(_game, 'main_theme', 0.3, true);
    objMainThemeMusic.play();
    $this.options.music = objMainThemeMusic;

    // Create Config Form
    var strForm = '';
    strForm += '<div style="position: absolute; top: 210px; left: 200px; height: 280px; width: 620px; font-family: Germania One;">';
    strForm += '   <table width="100%">'
    strForm += '      <tr>';
    strForm += '         <td width="45%" valign="top">';
    strForm += '            Playername: <input type="text" class="form-control" placeholder="Player Name">';
    strForm += '            Ship Color: <select id="ship_color" class="form-control">';
    strForm += '               <option value="green" selected>Green</option>';
    strForm += '               <option value="blue">Blue</option>';
    strForm += '               <option value="yellow">Yellow</option>';
    strForm += '               <option value="red">Red</option>';
    strForm += '            </select>';
    strForm += '         </td>';
    strForm += '         <td width="10%" valign="top">';
    strForm += '         </td>';
    strForm += '         <td width="45%" valign="top">';
    strForm += '            Language: <select class="form-control">';
    strForm += '               <option>PHP</option>';
    strForm += '               <option>C/C++</option>';
    strForm += '               <option>Java</option>';
    strForm += '               <option>JavaScript</option>';
    strForm += '               <option>Python</option>';
    strForm += '               <option>Ruby</option>';
    strForm += '            </select>';
    strForm += '            Input/Output Folder Path: <input type="text" class="form-control" placeholder="">';
    strForm += '            Execution Path: <input type="text" class="form-control" placeholder="">';
    strForm += '         </td>';
    strForm += '      </tr>';
    strForm += '   </table>';
    strForm += '</div>';
    $('#FormLayer').html(strForm);

    // Create Ship Preview
    var objShip = new Kiwi.GameObjects.Sprite(_state, 'ships');
    objShip.x = 290;
    objShip.y = 355;
    objShip.animation.switchTo(6);
    $this.options.ship = objShip;
    _state.addChild(objShip);
  };

  /**
   * changeShipColor
   * @description
   * This is changing the Preview Ships Color
   *
   * @param strColor    Color Name
   * @return void
   */
  _private.changeShipColor = function(strColor) {
    var numShipFrame = 6;
    if(strColor == 'green'){numShipFrame = 6};
    if(strColor == 'blue'){numShipFrame = 13};
    if(strColor == 'yellow'){numShipFrame = 20};
    if(strColor == 'red'){numShipFrame = 19};
    $this.options.ship.animation.switchTo(numShipFrame);
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
    $this.options.ship.rotation += 0.01;
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
