/**
 * SinglePlayerState
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var SinglePlayerState = function(game, app, options) {
  var $this = this;
  var _app = app;
  var _private = {};
  var _game = game;
  var _state = new Kiwi.State('SinglePlayerState');
  var helper = new Helper();

  // CodePirate System Variables
  this.options = $.extend({
    state: {},
    ship_config: '',
    ship: {},
    gui: {
      backbtn: {},
      playbtn: {},
    },
    maps: [],
    selected_map: '',
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
    _state.addSpriteSheet('ships', 'app/assets/images/sprites/ships.png', 76, 123);
    _state.addSpriteSheet('back_button', 'app/assets/images/gui/back_button.png', 204, 54);
    _state.addSpriteSheet('play_button', 'app/assets/images/gui/play_button.png', 204, 54);
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

    // Load Maps
    $this.loadMaps();

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
    var objSelectionTitle = new Kiwi.HUD.Widget.TextField (_game, 'Select your map', 425, 205);
    objSelectionTitle.style.fontFamily = "Germania One";
    objSelectionTitle.style.fontSize = "26px";
    objSelectionTitle.style.textAlign = "center";
    objSelectionTitle.style.color = "#848484";
    _game.huds.defaultHUD.addWidget(objSelectionTitle);

    // Create Back Button
    var objBackBtn = new Kiwi.GameObjects.Sprite(_state, 'back_button');
    objBackBtn.x = 130;
    objBackBtn.y = 540;
    objBackBtn.animation.switchTo(2);
    _state.addChild(objBackBtn);
    $this.options.gui.backbtn = objBackBtn;

    // Create Play Button
    var objPlayBtn = new Kiwi.GameObjects.Sprite(_state, 'play_button');
    objPlayBtn.x = 560;
    objPlayBtn.y = 415;
    objPlayBtn.animation.switchTo(2);
    _state.addChild(objPlayBtn);
    $this.options.gui.playbtn = objPlayBtn;

    // Create Config Form
    var strForm = '';
    strForm += '<div style="position: absolute; top: 250px; left: 200px; height: 280px; width: 620px; font-family: Germania One;">';
    strForm += '   <table width="100%">'
    strForm += '      <tr>';
    strForm += '         <td width="45%" valign="top">';
    strForm += '            <select id="map_selection" size="10" class="form-control" style="background-color: rgba(255, 255, 255, 0.5);">';

    // Create Map Record
    for(numIndex in $this.options.maps) {
      var objMap = $this.options.maps[numIndex];
      strForm += '<option value="' + objMap.name + '" data-index="' + numIndex + '">' + objMap.info.name + '</option>';
    }

    strForm += '            </select>';
    strForm += '         </td>';
    strForm += '         <td width="5%" valign="top">';
    strForm += '         </td>';
    strForm += '         <td width="150px" valign="top">';
    strForm += '            <img id="map_preview_img" src="" style="width: 150px; height: 150px; border: 1px solid #A4A4A4; border-radius: 5px;">';
    strForm += '         </td>';
    strForm += '         <td id="map_info_txt" width="25%" valign="top">';
    /* This is Multiplayer stuff ;-)
    strForm += '            Password: <input id="input_name" type="text" class="form-control" placeholder="Player Name">';
    strForm += '            Cannon Damage: <select id="input_color" class="form-control">';
    strForm += '               <option value="10" selected>10</option>';
    strForm += '               <option value="20">20</option>';
    strForm += '               <option value="25">25</option>';
    strForm += '               <option value="40">40</option>';
    strForm += '               <option value="50">50</option>';
    strForm += '               <option value="100">100</option>';
    strForm += '            </select>';
    */
    strForm += '         </td>';
    strForm += '      </tr>';
    strForm += '   </table>';
    strForm += '</div>';
    $('#FormLayer').html(strForm);

    // Form Events
    $('#map_selection').off().on('change', function() {
      var strValue = $('#map_selection').val();
      var numIndex = $('#map_selection').find('[value="' + strValue + '"]').data('index');
      $('#map_preview_img').attr('src', $this.options.maps[numIndex]['image']);
      $('#map_info_txt').html($this.options.maps[numIndex]['info']['description']);
      $this.options.selected_map = strValue;
    });
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
        _app.getState('MissionSelectState').setShipConfig($this.options.ship_config);
        _game.states.switchState("MissionSelectState");
      }
    } else {
      $this.options.gui.backbtn.animation.switchTo(2);
    }

    // PlayBtn Handling
    if(helper.isMouseOverElement($this.options.gui.playbtn)) {
      $this.options.gui.playbtn.animation.switchTo(0);
      if(helper.isMousePressed() && !$this.options.click.playbtn) {
        $this.options.click.playbtn = true;
        _game.huds.defaultHUD.removeAllWidgets();
        // Stop MainMenu Music
        _app.getState('MainMenuState').options.music.stop();
        $('#FormLayer').html("");

        // Switch to PlayGameState
        var objMission = {start_x: 32, start_y: 32, map: $this.options.selected_map};
        _app.getState('PlayGameState').setMission(objMission);
        _app.getState('PlayGameState').setShipConfig($this.options.ship_config, true, '');
        _game.states.switchState("PlayGameState");
      }
    } else {
      $this.options.gui.playbtn.animation.switchTo(2);
    }
  };

  /**
   * loadMaps
   * @description
   * Loading All Maps in Map Directory
   *
   * @param void
   * @return void
   */
  this.loadMaps = function() {
    const objFs = require('fs-jetpack');
    objList = objFs.list('app/data/maps');

    $this.options.maps = [];
    for(numIndex in objList) {
      var objFile = objFs.inspect('app/data/maps/' + objList[numIndex]);
      if(objFile.type == 'dir') {
        var objInfo = objFs.read('app/data/maps/' + objList[numIndex] + '/info.json', 'json');
        if(objInfo.type == 'singleplayer') {
          var objMap = {
            path: 'app/data/maps/' + objList[numIndex],
            name: objFile.name,
            info: objInfo,
            image: 'app/data/maps/' + objList[numIndex] + '/map.png'
          };
          $this.options.maps.push(objMap);
        }
      }
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
    $this.options.click.playbtn = true;

    // Reset Btn
    setTimeout(function() {
      $this.options.click.backbtn = false;
      $this.options.click.playbtn = false;
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
