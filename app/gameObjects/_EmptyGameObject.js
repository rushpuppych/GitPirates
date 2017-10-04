/**
 *  _EmptyGameObject
 * @description
 * CodePirate is a Programming learning Game for Geeks
 */
var _EmptyGameObject = function(state, options) {
  var $this = this;
  var _private = {};
  var _state = state;
  var helper = new Helper();

  // CodePirate System Variables
  this.options = $.extend({
    id: helper.uuid(),
    gameObject: {}
  }, options);

  /**
   * Constructor
   */
  this.init = function() {
    // Create Ship Object
    $this.options.gameObject = {};

  };

  /**
   * getGameOject
   * @description
   * This returns the KiwiGameObject
   *
   * @param void
   * @return Kiwi.GameObject
   */
  $this.getGameOject = function() {
    return $this.options.gameObject;
  };

  /**
   * getId
   * @description
   * This Returns the UUID of the GameObject
   *
   * @param void
   * @return Kiwi.GameObject
   */
  $this.getId = function() {
    return $this.options.id;
  };

  // Constructor Call
  $this.init();
};
