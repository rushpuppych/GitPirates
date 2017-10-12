/**
 * Helper
 * @description
 * Generic Jquery Helper Class
 */
var Helper = function() {
  var $this = this;
  var _private = {};

  // Helper System Variables
  this.options = {
    mouse: {
      x:0,
      y:0,
      isDown:false
    }
  }

  /**
   * Constructor
   */
  this.init = function() {
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
   * helperCallbackCall
   * @description
   * This Helper is managing the Callback Call.
   * @param fncCallback    This is the Callback function that should be called
   * @param arrParameters  This is the Optional Parameter Array fot the Callback Function
   * @return optional      Gives Return if the callback function provides a Return value
   */
  this.callbackCall = function(fncCallback, arrParameters) {
    if(typeof(fncCallback) == "function") {
      if(typeof(arrParameters) == 'undefined') {
        return fncCallback();
      } else {
        return fncCallback(arrParameters);
      }
    }
  };

  /**
   * uuid
   * @description
   * This Method is generating a Unique UUID
   * @param void
   * @return void
   */
  this.uuid = function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };

  /**
   * externdRecursively
   * @description
   * This Method is Mergin two Object Recursively
   * @param objObject1        Object 1
   * @param objObject2        Object 2
   * @return objMerged        The Merged Object
   */
  this.externdRecursively = function(objObject1, objObject2) {
    var objMerged = objObject1 ;
    for (var prop in objObject2){
        if (objObject2.hasOwnProperty(prop)){
            objMerged[prop] = objMerged[prop].concat(objObject2[prop]);
        }
    }
    return objMerged;
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
  this.isMouseOver = function(numX, numY, numWidth, numHeight){
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
  this.isMouseOverElement = function(objElement){
    var numMouseX = $this.options.mouse.x;
  	var numMouseY = $this.options.mouse.y;
    if(numMouseX > objElement.x && numMouseX < (objElement.x + objElement.width)) {
      if(numMouseY > objElement.y && numMouseY < (objElement.y + objElement.height)) {
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
  this.isMousePressed = function() {
    return $this.options.mouse.isDown;
  };

  // Constructor Call
  $this.init();
};
