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


var btnLayers = document.getElementById('layers');
btnLayers.addEventListener('click', function(e){
  recordLayers();
}, false)


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

// window.__adobe_cep__.resizeContent(60,200)
