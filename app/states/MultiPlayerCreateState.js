/**
 * MultiPlayerCreateState
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var MultiPlayerCreateState = function(game, app, options) {
  var $this = this;
  var _app = app;
  var _private = {};
  var _game = game;
  var _state = new Kiwi.State('MultiPlayerCreateState');
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
    var objSelectionTitle = new Kiwi.HUD.Widget.TextField (_game, 'Create your Game', 425, 205);
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
    strForm += '         <td width="35%" valign="top">';
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
    strForm += '         <td width="5%" valign="top">';
    strForm += '         </td>';
    strForm += '         <td width="35%" valign="top">';
    strForm += '            Name: <input id="input_name" type="text" class="form-control" placeholder="Game Name">';
    strForm += '            Players: <select id="input_players" class="form-control">';
    strForm += '               <option value="2" selected>2 Player</option>';
    strForm += '               <option value="3">3 Player</option>';
    strForm += '               <option value="4">4 Player</option>';
    strForm += '               <option value="5">5 Player</option>';
    strForm += '               <option value="6">6 Player</option>';
    strForm += '               <option value="7">7 Player</option>';
    strForm += '               <option value="8">8 Player</option>';
    strForm += '               <option value="9">9 Player</option>';
    strForm += '               <option value="10">10 Player</option>';
    strForm += '               <option value="11">11 Player</option>';
    strForm += '               <option value="12">12 Player</option>';
    strForm += '            </select>';
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
      // TODO: button activation from gray to active
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
        _app.getState('MultiPlayerState').setShipConfig($this.options.ship_config);
        _game.states.switchState("MultiPlayerState");
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

        // Register New Game
        var numMapIndex = $('#map_selection').find('[value="' + $('#map_selection').val() + '"]').data('index');
        var objData = {
          id: helper.uuid(),
          name: $('#input_name').val(),
          map: $('#map_selection').val(),
          map_name: $this.options.maps[numMapIndex]['info']['name'],
          slots: $('#input_players').val(),
          connected: []
        };
        $.ajax({
          type: "POST",
          url: 'http://localhost:3000/create',
          data: JSON.stringify(objData),
          contentType: 'application/json'
        });

        // Switch to PlayGameState
        var numPlayers = $('#input_players').val();
        var objMission = {start_x: 32, start_y: 32, map: $('#map_selection').val(), players: numPlayers};
        $('#FormLayer').html("");
        _app.getState('PlayGameState').setMission(objMission);
        _app.getState('PlayGameState').setShipConfig($this.options.ship_config, false, objData.id);
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
        if(objInfo.type == 'multiplayer') {
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
