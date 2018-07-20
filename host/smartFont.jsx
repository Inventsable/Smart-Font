var doc = app.documents[0];
var directory;
var setPath;
var setName;

function getFilePath(path){
  directory = path;
}

function setDirectory(setName){
  setPath = directory + "/" + setName;
  var setFolder = new Folder(setPath);
  setFolder.create();
}

function clearSet(){
  var setFolder = Folder(setPath);
  var setFile = setFolder.getFiles("*.svg");
  if ( !setFile.length ) {
    // alert("No files");
    return;
  } else {
    for (var i = 0; i < setFile.length; i++) {
      setFile[i].remove();
    }
  }


}

function layerNames(){
  var array = [];
  for (var i = 0; i < doc.layers.length; i++) {
    if (doc.layers[i].visible) {
      array.push(doc.layers[i].name + ';' + i);
    }
  }
  return array;
}

// setOptionsForSVGExport();

function setOptionsForSVGExport(){
  var options = new ExportOptionsWebOptimizedSVG();
  // options.saveMultipleArtboards = true;
  options.artboardRange = '1';
  options.coordinatePrecision = 2;
  options.fontType = SVGFontType.OUTLINEFONT;
  // options.svgMinify = true;
  options.svgId = SVGIdType.SVGIDREGULAR;
  options.cssProperties = SVGCSSPropertyLocation.STYLEELEMENTS;
  return options;
}

function exportSVG(index, name) {
  var newName = setPath + "/" + name + ".svg";
  var thisFile = new File(newName);
  var type = ExportType.WOSVG;
  doc.exportFile(thisFile, type, setOptionsForSVGExport());
}

function exportByLayer(index, name) {
  hideAllExcept(index);
  exportSVG(index, name);
}


function hideAllExcept(index){
  for (var i = 0; i < doc.layers.length; i++) {
    if (i == index) {
      doc.layers[index].visible = true;
    } else {
      doc.layers[i].visible = false;
    }
  }
}

function countLayers(){
  return doc.layers.length;
}

// alert(layerNames())
// alert(doc.layers[0].visible)




// var fileSpec = new File(newPath);
// doc.exportFile(fileSpec, type, exportOptions);
// alert("Successfully created file")


// var options = new ExportOptionsSVG;
// options.saveMultipleArtboards = false;
// options.cssProperties.STYLEATTRIBUTES;
// destFile = new File(newPath + "/test.svg");
//
// doc.exportFile(destFile, ExportType.SVG);

// function setSvgOptions(abIndex)
// {
//     var options = new ExportOptionsSVG();
//     options.preserveEditability = false;
//     options.saveMultipleArtboards = true;
//     options.artboardRange = "" + (abIndex + 1);
//     return options;
// }


// Loic.Aigon
// @ https://forums.adobe.com/thread/2445663

// function saveSvg(doc, filePath, options, artboardIndex, artboardName)
// {
//
// //Create a temporary folder
// var tmpFolder = Folder ( Folder.temp + "/" + artboardName );
// tmpFolder.create();
//
// //Create a reference to the file. Naming isn't really important as Illustrator will ignore naming
// //as we asked for saveMultipleArtboards : true
//     var tmpFile = new File(tmpFolder.fsName + "/" + artboardName + ".svg");
// destFile = new File(filePath + "/" + artboardName + ".svg");
// tmpFile.exists && tmpFile.remove();
//
//
// //Exporting to temp file
//     doc.exportFile(tmpFile, ExportType.SVG, options);
//
// //We know the file has been exported to tmpFolder
// //But we may not be sure of the naming
// //However there should be only one svg file there
// //So we presume it's our recently exported svg
// tmpFile = tmpFolder.getFiles("*.svg");
// if ( !tmpFile.length ) {
// alert("Couldn't export files sorry");
// tmpFolder.remove();
// }
//
//
// //Now we copy temp file to final destination with correct naming
// //And remove temp stuff
// tmpFile = tmpFile[0];
// tmpFile.copy ( destFile );
// tmpFile.remove();
// tmpFolder.remove();
// }
