var csInterface = new CSInterface();
var appSkin = csInterface.hostEnvironment.appSkinInfo;
var sysPath = csInterface.getSystemPath(SystemPath.EXTENSION);
var logPath = sysPath + "/log/";
var fontPath = sysPath + "/fonts/";
var hostPath = sysPath + "/host/";
var appName = csInterface.hostEnvironment.appName;
var setText = document.getElementById('set');

loadUniversalJSXLibraries();
console.log(`Loading for ${appName}`);
loadJSX(`${appName}.jsx`);
loadJSX(`smartFont.jsx`);
console.log(appUI);

csInterface.evalScript(`getFilePath('${fontPath}')`)

const layer = {};
recordLayers();
scanLayers(true);

function setLayers(params){
  console.log(params);
}

var btnExport = document.getElementById('push');
btnExport.addEventListener('click', function(e){
  csInterface.evalScript(`clearSet()`)
  var newSet = setText.value;
  csInterface.evalScript(`setDirectory('${newSet}')`)
  for (let [key, value] of Object.entries(layer)) {
    csInterface.evalScript(`exportByLayer('${key}', '${value}')`)
  }
}, false)


// var btnLayers = document.getElementById('layers');
// btnLayers.addEventListener('click', function(e){
//   recordLayers();
// }, false)


function recordLayers(){
  for (var member in layer) delete layer[member];
  console.log(layer);
  console.log("recording layers...");
  csInterface.evalScript(`layerNames()`, function(a){
    var layerMirror = {};
    var res = a.split(',');
    for (var m = 0; m < res.length; m++) {
      layerMirror[m] = res[m].split(';')
      var index = layerMirror[m][1];
      var value = layerMirror[m][0];
      layer[index] = value;
    };
    console.log(layer);
  });
}


function scanLayers(state){
  var timer, scanRes;
  if (state){
    timer = setInterval(function(){csInterface.evalScript('layerNames();', function(a){
      if (a == scanRes) return;
      if (a !== scanRes) {
        recordLayers();
      }
      scanRes = a;
    })}, 50);
    console.log("scanning layers on");
  } else {
    clearInterval(timer);
    console.log("scanning layers off");
  }
}

// https://stackoverflow.com/a/14070928
xhr = new XMLHttpRequest();
xhr.open("GET","../fonts/SmartAlign2/alignSE.svg",false);
// Following line is just to be on the safe side;
// not needed if your server delivers SVG with correct MIME type
xhr.overrideMimeType("image/svg+xml");
xhr.send("");
document.getElementById("placeHolder")
  .appendChild(xhr.responseXML.documentElement);
