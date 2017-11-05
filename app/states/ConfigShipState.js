/**
 * ConfigShipState
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var ConfigShipState = function(game, app, options) {
  var $this = this;
  var _app = app;
  var _private = {};
  var _game = game;
  var _state = new Kiwi.State('ConfigShipState');
  var helper = new Helper();

  // CodePirate System Variables
  this.options = $.extend({
    ship_config: "",
    score: 0,
    qualification: false,
    state: {},
    music: {},
    ship: {},
    gui: {},
    click: {}
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
    $('body').on('change', '#input_color', function() {
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
    _state.addSpriteSheet('back_button', 'app/assets/images/gui/back_button.png', 204, 54);
    _state.addSpriteSheet('save_button', 'app/assets/images/gui/save_button.png', 204, 54);
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
    var objSelectionTitle = new Kiwi.HUD.Widget.TextField (_game, 'Configure your ship', 405, 205);
    objSelectionTitle.style.fontFamily = "Germania One";
    objSelectionTitle.style.fontSize = "26px";
    objSelectionTitle.style.textAlign = "center";
    objSelectionTitle.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objSelectionTitle);

    // Create Config Form
    var strForm = '';
    strForm += '<div style="position: absolute; top: 250px; left: 200px; height: 280px; width: 620px; font-family: Germania One;">';
    strForm += '   <table width="100%">'
    strForm += '      <tr>';
    strForm += '         <td width="45%" valign="top">';
    strForm += '            Playername: <input id="input_name" type="text" class="form-control" placeholder="Player Name" style="background-color: rgba(255, 255, 255, 0.5);">';
    strForm += '            Ship Color: <select id="input_color" class="form-control" style="background-color: rgba(255, 255, 255, 0.5);">';
    strForm += '               <option value="green" selected>Green</option>';
    strForm += '               <option value="blue">Blue</option>';
    strForm += '               <option value="yellow">Yellow</option>';
    strForm += '               <option value="red">Red</option>';
    strForm += '            </select>';
    strForm += '         </td>';
    strForm += '         <td width="10%" valign="top">';
    strForm += '         </td>';
    strForm += '         <td width="45%" valign="top">';
    strForm += '            Language: <select id="input_lang" class="form-control" style="background-color: rgba(255, 255, 255, 0.5);">';
    strForm += '               <option value="PHP">PHP</option>';
    strForm += '               <option value="CPP">C++</option>';
    strForm += '               <option value="JVM">Java</option>';
    strForm += '               <option value="JS">JavaScript</option>';
    strForm += '               <option value="PY">Python</option>';
    strForm += '               <option value="CS">CSharp</option>';
    strForm += '               <option value="RB">Ruby</option>';
    //strForm += '               <option value="BAS">Basic</option>';
    //strForm += '               <option value="ASM">Assembler (x86)</option>';
    //strForm += '               <option value="BAT">Win Batch</option>';
    //strForm += '               <option value="SH">Shellscript (Linux)</option>';
    strForm += '            </select>';
    strForm += '            Input/Output Folder Path: <input id="input_iopath" type="text" class="form-control" placeholder="" style="background-color: rgba(255, 255, 255, 0.5);">';
    strForm += '            Execution Path: <input id="input_exec" type="text" class="form-control" placeholder="" style="background-color: rgba(255, 255, 255, 0.5);">';
    strForm += '         </td>';
    strForm += '      </tr>';
    strForm += '   </table>';
    strForm += '</div>';
    $('#FormLayer').html(strForm);

    // Create Ship Preview
    var objShip = new Kiwi.GameObjects.Sprite(_state, 'ships');
    objShip.x = 290;
    objShip.y = 375;
    objShip.animation.switchTo(6);
    $this.options.ship = objShip;
    _state.addChild(objShip);

    // Load Config
    _private.loadConfig($this.options.ship_config);
    _private.changeShipColor($("#input_color").val());

    // Create Back Button
    var objBackBtn = new Kiwi.GameObjects.Sprite(_state, 'back_button');
    objBackBtn.x = 130;
    objBackBtn.y = 540;
    objBackBtn.animation.switchTo(2);
    _state.addChild(objBackBtn);
    $this.options.gui.backbtn = objBackBtn;

    // Create Save Button
    var objSaveBtn = new Kiwi.GameObjects.Sprite(_state, 'save_button');
    objSaveBtn.x = 690;
    objSaveBtn.y = 540;
    objSaveBtn.animation.switchTo(2);
    _state.addChild(objSaveBtn);
    $this.options.gui.savebtn = objSaveBtn;
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
   * saveShip
   * @description
   * This is saving a ship Configuration
   *
   * @param void
   * @return void
   */
  _private.save = function() {
    const objFs = require('fs-jetpack');
    var objShipData = {
      name: $('#input_name').val(),
      color: $('#input_color').val(),
      lang: $('#input_lang').val(),
      executable: $('#input_exec').val(),
      iofolder: $('#input_iopath').val(),
      score: $this.options.score,
      qualified: $this.options.qualification
    }

    // TODO: Validation

    var strShipData = JSON.stringify(objShipData);
    objFs.write($this.options.ship_config, strShipData);
  };

  /**
   * loadConfig
   * @description
   * This Loads the Actual Config
   *
   * @param strFilePath   FilePath of the Ship Config
   * @return void
   */
  _private.loadConfig = function(strFilePath) {
    const objFs = require('fs-jetpack');
    if(objFs.exists(strFilePath)) {
      objShip = JSON.parse(objFs.read(strFilePath));
      $('#input_name').val(objShip.name);
      $('#input_color').val(objShip.color);
      $('#input_lang').val(objShip.lang);
      $('#input_exec').val(objShip.executable);
      $('#input_iopath').val(objShip.iofolder);
      $this.options.score = objShip.score;
      $this.options.qualification = objShip.qualified;
    }
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

    // Ship Rotation
    $this.options.ship.rotation += 0.01;

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

    // SaveBtn Handling
    if(helper.isMouseOverElement($this.options.gui.savebtn)) {
      $this.options.gui.savebtn.animation.switchTo(0);
      if(helper.isMousePressed() && !$this.options.click.savebtn) {
        $this.options.click.savebtn = true;
        _private.save();
        _game.huds.defaultHUD.removeAllWidgets();
        $('#FormLayer').html("");
        _game.states.switchState("MainMenuState");
      }
    } else {
      $this.options.gui.savebtn.animation.switchTo(2);
    }
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
    $this.options.click.savebtn = true;
    $this.options.click.backbtn = true;

    // Reset Btn
    setTimeout(function() {
      $this.options.click.savebtn = false;
      $this.options.click.backbtn = false;
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

  // Constructor Call
  $this.init();
};
