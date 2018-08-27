(function () {
  'use strict';

  var csInterface = new CSInterface();

  csInterface.addEventListener('com.init', function(evt) {
    console.log("Initializing console");
  });

  csInterface.addEventListener('com.smartFont.svgReady', function(evt) {
    var back = evt.data;
    var backPack = back.split(';');
    // sleep(200);
    // injectSVGImage(backPack[3], backPack[2], backPack[0])
  });

  dispatchEvent("com.plug", "Plugged In")
  function dispatchEvent(name, data) {
  	var event = new CSEvent(name, 'APPLICATION');
  	event.data = data;
  	csInterface.dispatchEvent(event);
  }

  csInterface.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", log);
    function log(event){
    console.log(event);
  }

  csInterface.addEventListener("com.adobe.csxs.events", log);
    function log(event){
    console.log(event);
    console.log(" triggered ");
  }

  csInterface.addEventListener('mighty.rollcall', function(evt) {
    dispatchEvent('mighty.rollanswer', extFolder())
  });

  //  btn.addEventListener("click", function(evt){
  // 	dispatchEvent(name, data)
  // }, false);


}());
