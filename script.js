var coloriNome = ["transparent","white","grey","black","red","pink","magenta","purple","blue","light blue","cyan","spring green","green","acid green","yellow","orange"];
var coloriHex = ["FFFFFF00","FFFFFF","7F7F7F","000000","FF0000","FF007F","FF00FF","7F00FF","0000FF","007FFF","00FFFF","00FF7F","00FF00","7FFF00","FFFF00","FF7F00"];
var colori = [];
for (var i = 0; i < coloriNome.length; i++) {
  colori[i] = {};
  colori[i].nome = coloriNome[i];
  colori[i].hex = "#" + coloriHex[i];
  colori[i].numero = i;
  colori[i].filhex = "fil" + i + "_hex";
  colori[i].filnome = "fil" + i + "_nome";
  colori[i].filx = "fil" + i + "_x";
  colori[i].fily = "fil" + i + "_y";
}

var app = new Vue({
  el: ".mainOuterDiv",
  data: {
    colori: colori
  }
})
//default
function getFilamentHexDefaults(){
  const defaults = {};
  for (var i = 0; i < coloriNome.length; i++) {
    defaults["fil" + i] = coloriHex[i];
  }
  return defaults;
}
function getFilamentNamesDefaults(){
  const defaults = {};
  for (var i = 0; i < coloriNome.length; i++) {
    defaults["fil" + i] = coloriNome[i];
  }
  return defaults;
}
const bedSizes = {x: 0, y: 0}
function getFilamentPositionsDefaults(){
  const bedSize = bedSizes;
  const defaults = {};
  defaults["fil0"] =  { x: 0,                             y: 0                             };
  defaults["fil1"] =  { x: Math.round(bedSize.x / 3),     y: 0                             };
  defaults["fil2"] =  { x: Math.round(bedSize.x * 2 / 3), y: 0                             };
  defaults["fil3"] =  { x: bedSize.x,                     y: 0                             };
  defaults["fil4"] =  { x: 0,                             y: Math.round(bedSize.y / 3)     };
  defaults["fil5"] =  { x: Math.round(bedSize.x / 3),     y: Math.round(bedSize.y / 3)     };
  defaults["fil6"] =  { x: Math.round(bedSize.x * 2 / 3), y: Math.round(bedSize.y / 3)     };
  defaults["fil7"] =  { x: bedSize.x,                     y: Math.round(bedSize.y / 3)     };
  defaults["fil8"] =  { x: 0,                             y: Math.round(bedSize.y * 2 / 3) };
  defaults["fil9"] =  { x: Math.round(bedSize.x / 3),     y: Math.round(bedSize.y * 2 / 3) };
  defaults["fil10"] = { x: Math.round(bedSize.x * 2 / 3), y: Math.round(bedSize.y * 2 / 3) };
  defaults["fil11"] = { x: bedSize.x,                     y: Math.round(bedSize.y * 2 / 3) };
  defaults["fil12"] = { x: 0,                             y: bedSize.y                     };
  defaults["fil13"] = { x: Math.round(bedSize.x / 3),     y: bedSize.y                     };
  defaults["fil14"] = { x: Math.round(bedSize.x * 2 / 3), y: bedSize.y                     };
  defaults["fil15"] = { x: bedSize.x,                     y: bedSize.y                     };
  return defaults;
}
var filamentHexDefaults = getFilamentHexDefaults();
var filamentNamesDefaults = getFilamentNamesDefaults();
var filamentPositionsDefaults = getFilamentPositionsDefaults();

var filamentHex = { ...filamentHexDefaults };
var filamentNames = { ...filamentNamesDefaults };
var filamentPositions = { ...filamentPositionsDefaults };

function loadDefaultPlaceHolders(){
  filamentPositionsDefaults = getFilamentPositionsDefaults();
  const bedSize = bedSizes;
  for(let i = 0; i < coloriNome.length; i++){
    const currentFilament = "fil" + i;
    const inputX = $("#" + currentFilament + "_x");
    const inputY = $("#" + currentFilament + "_y");
    if(Number(inputX[0].value) > bedSize.x){
      inputX[0].value = bedSize.x;
    }
    if(Number(inputY[0].value) > bedSize.y){
      inputY[0].value = bedSize.y;
    }
    inputX.attr({
      "placeholder" : filamentPositionsDefaults[currentFilament].x,
      "max" : bedSize.x
    });
    inputY.attr({
      "placeholder" : filamentPositionsDefaults[currentFilament].y,
      "max" : bedSize.y
    });
  }
}
function hexToRgb(hex){
  var result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function rubToRgb(line){
  var rgb = [0, 0, 0];
  var temp = "";
  const regexLedR = /R[0-9]{1,3}/g;
  const regexLedG = /U[0-9]{1,3}/g;
  const regexLedB = /B[0-9]{1,3}/g;
  const regexLed = /[0-9]{1,3}/g;
  for (var i = 0; i < line.length; i++) {
    if(regexLedR.test(line[i])){
      rgb[0] = line[i].match(regexLed)[0];
    }
    if(regexLedG.test(line[i])){
      rgb[1] = line[i].match(regexLed)[0];
    }
    if(regexLedB.test(line[i])){
      rgb[2] = line[i].match(regexLed)[0];
    }
  }
  return {
    r: rgb[0],
    g: rgb[1],
    b: rgb[2]
  };
}
function download(filename, text){
  console.log("downloading")
  $("div.mainOuterDiv").append("<a>");
  $("div.mainOuterDiv a").attr({"href": "data:text/plain;charset=utf-8," + encodeURIComponent(text), "download": filename, "id": "elementDownload"}).hide();
  document.getElementById("elementDownload").click();
  $("div.mainOuterDiv a#elementDownload").remove();
}
function resetFileUpload(){
  const oldInput = $("#file-upload")[0];
  $("#file-upload").after("<input>");
  $("#file-upload+input").attr({"type": "file", "id": oldInput.id});
  $("#file-upload")[0].remove();
}
//Critical Functions
function processFile_mini(){
  const inputField = $("#file-upload")[0];
  const file = inputField.files[0]
  var nomeFile = file.name.split(".")[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const file = event.target.result;
    const allLines = file.split(/\r\n|\n/);
    // Reading line by line
    const regex = /\s+/;
    console.log("processing")
    var processedLines = []
    var prevTool;
    var prevIndex;
    var prevLed;
    const regexToTest = /^\s*(T[0-9][0-9]|T[0-9])\s*(;.*)?$/g;
    const regexToExtract = /(T[0-9][0-9]|T[0-9])/g;
    const regexToTestLed = /^\s*(M150)\s*/g;
    const regexToExtractLed = /([RUB][0-9]{1,3})/g;
    for (let i = 0; i < allLines.length; i++){
      const line = allLines[i];
      if(regexToTest.test(line)){
        const toolNumber = "fil" + Number(line.match(regexToExtract)[0].substring(1));
        processedLines.push([toolNumber, prevTool, undefined, prevLed]);
        if(prevIndex !== undefined){
          processedLines[prevIndex][2] = toolNumber;
        }
        prevIndex = i;
        prevTool = toolNumber;
      }else if(regexToTestLed.test(line)){
        prevLed = line.match(regexToExtractLed);
        processedLines.push(line);
      }else{
        processedLines.push(line);
      }
    }
    const finalGCode = processedLines.flatMap((line) => {
      if (Array.isArray(line)){
        const [toolNumber, prevTool, nextTool, prevLed] = line;
        const messageLine1 = "M117 " + filamentNames[toolNumber];
        const messageLine15 = "M150 " + "R" + hexToRgb(filamentHex[toolNumber]).r + " U" + hexToRgb(filamentHex[toolNumber]).g + " B" + hexToRgb(filamentHex[toolNumber]).b;
        const filamentChangeLine = "M600 " + "X" + filamentPositions[toolNumber].x + " Y" + filamentPositions[toolNumber].y;
        const messageLine2 = (() => {
          if(nextTool !== undefined){
            return "M117 " + filamentNames[nextTool];
          }else{
            return "";
          }
        }).call(this)
        const messageLine25 = (() => {
          if(nextTool !== undefined){
            return "M150 " + "R" + hexToRgb(filamentHex[nextTool]).r + " U" + hexToRgb(filamentHex[nextTool]).g + " B" + hexToRgb(filamentHex[nextTool]).b;
          }else{
            return "";
          }
        }).call(this)
        const messageLineLed = (() => {
          if(prevLed !== undefined){
            return "M150 " + "R" + rubToRgb(prevLed).r + " U" + rubToRgb(prevLed).g + " B" + rubToRgb(prevLed).b;
          }else{
            return "";
          }
        }).call(this)
        return [messageLine1, messageLine15, "M400", filamentChangeLine, messageLine2, messageLine25, "M400", messageLineLed, "M400"];
      }else{
        return [line];
      }
    }).join("\n")
    console.log("processed")
    download(nomeFile + "_processed.gcode", finalGCode);
  };
  reader.onerror = (event) => {
    alert(event.target.error.name);
  };
  reader.readAsText(file);
  resetFileUpload();
}

jQuery(function($){
  loadDefaultPlaceHolders();
  $(".form.formName input[id^='fil'][id$='_hex']").each(function(){
    $(this).on("change", function(){
      const field = $("#" + this.id)[0];
      const filamentName = this.id.split("_")[0];
      filamentHex[filamentName] = field.value.split("#")[1];
      $("label[for=" + this.id + "]").text(field.value);
    });
	});
	$(".form.formName input[id^='fil'][id$='_nome']").each(function(){
    $(this).on("change", function(){
      const field = $("#" + this.id)[0];
      const filamentName = this.id.split("_")[0];
      if(field.value == ""){
        filamentNames[filamentName] = filamentNamesDefaults[filamentName];
      }else{
        filamentNames[filamentName] = field.value;
      }
    });
	});
  $(".form.formPosition input[id^='fil']").each(function(){
    $(this).on("change", function(){
      const field = $("#" + this.id)[0];
      const filamentName = this.id.split("_")[0];
      const coordName = this.id.split("_")[1];
      const bedSize = bedSizes;
      if(field.value < 0){
        field.value = 0;
      }
      if(field.value > bedSize[coordName]){
        field.value = bedSize[coordName];
      }
      if(field.value == ""){
        filamentPositions[filamentName][coordName] = filamentPositionsDefaults[filamentName][coordName];
      }else{
        filamentPositions[filamentName][coordName] = Number(field.value);
      }
    });
	});
  $("input#file-upload").on("change", function(){
    switch ($("#printers")[0].value){
      case "mini":
        processFile_mini();
        break;
      case "i3prob":
        processFile_mini();
        break;
    }
	});
  $("#bedX").on("change", function(){
    const field = $("#bedX")[0];
    if(field.value < 0){
      field.value = 0;
    }
    if(field.value == ""){
      bedSizes.x = 0;
    }else{
      bedSizes.x = Number(field.value);
    }
    filamentPositions = filamentPositionsDefaults;
    loadDefaultPlaceHolders();
	});
  $("#bedY").on("change", function(){
    const field = $("#bedY")[0];
    if(field.value < 0){
      field.value = 0;
    }
    if(field.value == ""){
      bedSizes.y = 0;
    }else{
      bedSizes.y = Number(field.value);
    }
    filamentPositions = filamentPositionsDefaults;
    loadDefaultPlaceHolders();
	});
});
