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

var grid;
var block;
var newSet = 'SmartAlign2';
var painting = false;
var gridParent = document.getElementById('grid');
const layer = {};
var gridLock = false;
var previewLength;
var noSelection = false;
recordLayers();
// scanLayers(true);
buildGrid(1);

function setLayers(params){
  console.log(params);
}

var btnExport = document.getElementById('push');
btnExport.addEventListener('click', function(e){
  painting = true;
  savePreviewGrid();
  csInterface.evalScript(`clearSet()`)
  newSet = setText.value;
  csInterface.evalScript(`setDirectory('${newSet}')`)
  var count = -1;
  for (let [key, value] of Object.entries(layer)) {
    count++;
    csInterface.evalScript(`exportByLayer('${newSet}', '${count}', '${key}', '${value}')`)
  }
  resetPreviewGrid();
  painting = false;
}, false)

var lock = document.getElementById('lock');
lock.addEventListener('click', function(e){
  e = e.target;
  lockGrid('toggle');
}, false)

var lockIcon = document.getElementById('lockIcon');

function lockGrid(params) {
  if (params == 'toggle')
    gridLock = !gridLock;
  else if (params)
    gridLock = true;
  else if (!params)
    gridLock = false;

  if (gridLock) {
    lockIcon.classList.remove('fa-lock', 'fa-unlock-alt');
    lockIcon.classList.add('fa-lock');
  } else {
    lockIcon.classList.remove('fa-lock', 'fa-unlock-alt');
    lockIcon.classList.add('fa-unlock-alt');
  }
}

function savePreviewGrid(){
  previewLength = Object.keys(layer).length;
}

function resetPreviewGrid(){
  buildGrid(previewLength)
  var count = -1;
  for (let [key, value] of Object.entries(layer)) {
    count++;
    csInterface.evalScript(`unhideLayer(${key})`)
  }
  lockGrid(true);
  console.log("total is " + (count + 1));
  console.log("ending preview");
}


// var btnLayers = document.getElementById('layers');
// btnLayers.addEventListener('click', function(e){
//   recordLayers();
// }, false)


function recordLayers(){
  for (var member in layer) delete layer[member];
  csInterface.evalScript(`layerNames()`, function(a){
    if (a.length < 1) {
      noSelection = true;
    } else {
      noSelection = false;
    }
    var layerMirror = {};
    var res = a.split(',');
    for (var m = 0; m < res.length; m++) {
      layerMirror[m] = res[m].split(';')
      var index = layerMirror[m][1];
      var value = layerMirror[m][0];
      layer[index] = value;
    };
    if (!gridLock) {
      buildGrid(res.length);
      if (noSelection)
      clearGrid();
    }
    return res.length;
  });
}


function clearGrid() {
  block = [].slice.call(document.getElementsByClassName('adobe-gridBlock'));
  block.forEach(function(v,i,a) {
    v.remove();
  });
}

function buildGrid(num) {
  clearGrid();
  grid = [];
  for (var i = 1; i <= num; i++) {
    var newBlock = document.createElement("div");
    newBlock.id = "block" + (i - 1);
    newBlock.classList.add("adobe-gridBlock");
    gridParent.appendChild(newBlock);
    grid.push(newBlock);
  }
  // if (painting) {
  //   injectAllSVGs(newSet);
  // }
  // AJAXtest();
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

// injectSVGfromAJAX('SmartAlignNull', 'alignX', 1);
// injectSVGfromAJAX('SmartAlignNull', 'alignY', 2)


// function injectAllSVGs(set){
//   var layerArray = [];
//   var count = -1;
//   for (let [key, value] of Object.entries(layer)) {
//     layerArray.push(key)
//   }
//   block = [].slice.call(document.getElementsByClassName('adobe-gridBlock'));
//   block.forEach(function(v,i,a) {
//     ++count;
//     console.log(v);
//   });
// }



// function AJAXtest(){
//   var client = new XMLHttpRequest();
//   // client.onload = handler;
//   client.open("GET", "../fonts/SmartAlign2/alignX.svg");
//   // client.send();
//   client.overrideMimeType("image/svg+xml");
//   client.send("");
//   document.getElementById('block0')
//   .appendChild(client.responseXML.documentElement);
// }

// function processData(data) {
//   // taking care of data
// }
//
// function handler() {
//   if(this.status == 200 &&
//     this.responseXML != null &&
//     this.responseXML.getElementById('test').textContent) {
//     // success!
//     processData(this.responseXML.getElementById('gridSet').textContent);
//   } else {
//     console.log("something went wrong");
//   }
// }



function injectSVGfromAJAX(set, file, target){
  // https://stackoverflow.com/a/14070928
  xhr = new XMLHttpRequest();
  xhr.open("GET","../fonts/" + set + "/" + file + ".svg",false);
  // xhr.open("GET","../fonts/SmartAlign2/alignCenter.svg",false);
  // Following line is just to be on the safe side;
  // not needed if your server delivers SVG with correct MIME type
  xhr.overrideMimeType("image/svg+xml");
  xhr.send("");
  // console.log(xhr.responseXML.documentElement);
  // target
  document.getElementById('gridSet' + target)
  .appendChild(xhr.responseXML.documentElement);
}


// loadSVG('#gridSet1', '../fonts/SmartAlignNull/alignX')

// https://codepen.io/eltonmesquita/post/loading-inline-svg
function loadSVG(selector, url) {
  var target = document.querySelector(selector);

  // If SVG is supported
  if (typeof SVGRect != "undefined") {
    // Request the SVG file
    var ajax = new XMLHttpRequest();
    ajax.open("GET", url + ".svg", true);
    ajax.send();
    // Append the SVG to the target
    ajax.onload = function(e) {
      target.innerHTML = ajax.responseText;
    }
  } else {
    // Fallback to png
    target.innerHTML = "<img src='" + url + ".png' />";
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function injectSVGImage(set, file, target) {
  var image = document.createElement('img');
  image.src = "../fonts/SmartAlignNull/" + file + ".svg";
  // image.src = "../fonts/" + set + "/" + file + ".svg";
  var parent = document.getElementById('block' + target);
  parent.appendChild(image);
}
