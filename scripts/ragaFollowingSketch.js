var extraSpaceH = 45;
var extraSpaceW = 0;
var mainSpace = 600;
var margin = 10;
var easing = 0.5;
var backColor;
var backColorTrans;
var frontColor;
// var shadeColor;
var mainColor;
var aksaraColor;

var recordingsInfo;
var recordingsList;
var ragInfo;
var pitchSpace;
var svaraList = [];
var soundList = {};
var svaraRadius1 = 20;
var svaraRadius2 = 17;
var svaraLine = 50;
var minHz;
var maxHz;
var pitchTrack;
var trackFile;
var track;
var trackDuration;
var ragName;
var artist;
var link;

var selectMenu;
var buttonPlay;
// var showTheka;
var showTala;
var showCursor;

var cursorTop;
var cursorBottom;
var cursorY = 0;
var navBoxH = 50;
var navCursor;
var navBox;
var navCursorW = 4;
var samaList = [];
var radiusBig; //radius of the big circle
var radius1 = 25; //radius of accented aksara
var radius2 = 17; //radius of unaccented aksara
var melCursorX;
var melCursorRadius = 6;
var clock;
var apmTxt;

var talaInfo;
var talaCursor;
var talX;
var talY;
var talaRadius;
var secBoxes = [];
var talaCircle;
var displayTala;
var talList = {};
var talCircles = {};
var talName = undefined;
var currentTal = undefined;
var currentAvartana;
var strokeRadius1 = 20;
var strokeRadius2 = 15;
var iconDistance = 0.6;

var failedLoading;
var loaded = false;
var paused = true;
var charger;
var currentTime = 0;
var jump;
// Language
var lang_select;
var lang_load;
var lang_error;
var lang_start;
var lang_pause;
var lang_continue;
var lang_loading;

var svaras = {"Sa": 0, "Ri1": 100, "Ri2": 200, "Ri3": 300, "Ga1": 200, "Ga2": 300, "Ga3": 400, "Ma1": 500, "Ma2": 600, "Pa": 700, "Dha1": 800, "Dha2": 900, "Dha3": 1000, "Ni1": 900, "Ni2": 1000, "Ni3": 1100};
var octave0 = "qwertyuiop";
var octave1 = "asdfghjkl;";
var octave2 = "zxcvbnm,./";

function preload() {
  recordingsList = loadJSON("../files/ragaFollowing-recordingsList.json");
  recordingsInfo = loadJSON("../files/recordingsInfo.json");
  ragaInfo = loadJSON("../files/ragaInfo.json")
  talaInfo = loadJSON("../files/talaInfo.json");
  wave = loadImage("../images/wave.svg");
  clap = loadImage("../images/clap.svg");
}

function setup () {
  var canvas = createCanvas(extraSpaceW+mainSpace, extraSpaceH+mainSpace);
  var div = select("#sketch-holder");
  div.style("width: " + width + "px; margin: 10px auto; position: relative;");
  canvas.parent("sketch-holder");

  background(254, 249, 231);

  ellipseMode(RADIUS);
  angleMode(DEGREES);
  imageMode(CENTER);
  textFont("Laila");
  strokeJoin(ROUND);
  strokeCap(ROUND);

  backColor = color(240, 128, 128);
  backColorTrans = color(120, 0, 0, 100);
  frontColor = color(120, 0, 0);
  // shadeColor = color(120, 0, 0);
  mainColor = color(249, 134, 50);
  aksaraColor = color(249, 175, 120);

  charger = new CreateCharger();
  navBox = new CreateNavigationBox();
  navCursor = new CreateNavCursor();
  talaCursor = new CreateTalaCursor();

  cursorTop = extraSpaceH + margin*7 + 50;
  cursorBottom = navBox.y1-margin*4;
  talX = extraSpaceW + margin + (mainSpace-2*margin)/3;
  talY = cursorTop + (cursorBottom-cursorTop)/2.8 + strokeRadius1/2;
  talaRadius = (cursorBottom-cursorTop)/2.8;// (mainSpace-2*margin)*0.25;
  melCursorX = extraSpaceW + (mainSpace-2*margin)*0.75;

  //Language
  var lang = select("html").elt.lang;
  print(lang);
  if (lang == "es") {
    lang_load = "Carga el audio";
    lang_select = "Elige";
    lang_error = "Ha habido un problema cargando el audio\nPor favor, vuelve a cargar la página";
    lang_start = "¡Comienza!";
    lang_pause = "Pausa";
    lang_continue = "Sigue";
    lang_loading = "Cargando...";
  } else if (lang == "en") {
    lang_load = "Load the audio";
    lang_select = "Select";
    lang_error = "There was a problem loading the audio\nPlease, reaload the page";
    lang_start = "Start!";
    lang_pause = "Pause";
    lang_continue = "Play";
    lang_loading = "Loading...";
  }

  infoLink = select("#sa-info-link");
  infoLink.position(width-60, extraSpaceH + margin*3.5 + 30);
  selectMenu = createSelect()
    .size(120, 25)
    .position(margin, margin)
    .changed(start)
    .parent("sketch-holder");
  selectMenu.option(lang_select);
  var noRec = selectMenu.child();
  noRec[0].setAttribute("selected", "true");
  noRec[0].setAttribute("disabled", "true");
  noRec[0].setAttribute("hidden", "true");
  noRec[0].setAttribute("style", "display: none");
  recordingsList = recordingsList.recordingsList;
  for (var i = 0; i < recordingsList.length; i++) {
    selectMenu.option(recordingsList[i].selectOption, i);
  }
  buttonPlay = createButton(lang_load)
    .size(120, 25)
    .position(width - 120 - margin, margin)
    .mouseClicked(player)
    .attribute("disabled", "true")
    .parent("sketch-holder");

  // showTheka = createCheckbox(' ṭhekā', true)
  //   .position(extraSpaceW + margin, talY + talRadius)
  //   .parent("sketch-holder");
  showTala = createCheckbox(' tāla', true)
    // .position(extraSpaceW + margin, showTheka.position()["y"] + showTheka.height)
    .position(extraSpaceW + margin, talY + talaRadius)
    // .changed(function() {
    //   showTheka.checked(showTala.checked());
    //   if (showTala.checked()) {
    //     showTheka.removeAttribute("disabled");
    //   } else {
    //     showTheka.attribute("disabled", "true");
    //   }
    // })
    .parent("sketch-holder");
  showCursor = createCheckbox(' cursor', true)
    .position(margin, showTala.position()["y"]+showTala.height)
    .parent("sketch-holder");
  // showTheka.attribute("disabled", "true");
  // showTheka.attribute("style", "color:rgba(120, 0, 0, 0.5);");
  showTala.attribute("disabled", "true");
  showTala.attribute("style", "color:rgba(120, 0, 0, 0.5);");
  showCursor.attribute("disabled", "true");
  showCursor.attribute("style", "color:rgba(120, 0, 0, 0.5);");
}

function draw () {
  fill(backColor);
  noStroke();
  rect(extraSpaceW, extraSpaceH, width, height);

  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(30);
  strokeWeight(5);
  stroke(frontColor);
  fill(backColor);
  text(ragName, extraSpaceW + mainSpace/2, extraSpaceH + margin*3);

  stroke(0, 50);
  strokeWeight(1);
  line(extraSpaceW + margin*2, extraSpaceH + margin*3 + 30, width - margin*2, extraSpaceH + margin*3 + 30);

  textAlign(CENTER, TOP);
  stroke(0, 150);
  strokeWeight(1);
  textSize(20);
  fill(0, 150);
  text(artist, extraSpaceW + mainSpace/2, extraSpaceH + margin*4 + 30);

  // stroke("red");
  // line(0, cursorTop, width, cursorTop);
  // stroke("green");
  // line(0, cursorBottom, width, cursorBottom);

  for (var i = 0; i < svaraList.length; i++) {
    svaraList[i].displayLines();
  }
  for (var i = 0; i < svaraList.length; i++) {
    svaraList[i].displaySvara();
  }

  navBox.displayBack();

  if (loaded) {
    navCursor.update();
    navCursor.display();
    clock.display();

    if (!paused) {
      currentTime = track.currentTime();
    }

    var p = pitchTrack[currentTime.toFixed(2)];
    if (p != "s" && p >= -700 && p <= 1900) {
      var targetY = map(p, -700, 1900, cursorBottom, cursorTop);
      cursorY += (targetY - cursorY) * easing;
      stroke(frontColor);
      strokeWeight(1);
      ellipse(melCursorX, cursorY, melCursorRadius, melCursorRadius);
    }
  }

  push();
  translate(talX, talY);

  if (failedLoading) {
    textAlign(CENTER, CENTER);
    textSize(15)
    noStroke()
    fill(0)
    text(lang_error, 0, 0);
  }

  rotate(-90);

  if (loaded) {
    noFill();
    stroke(frontColor);
    strokeWeight(2);
    ellipse(0, 0, talaRadius, talaRadius);

    // if (showTala.checked()) {
    //   shade.update();
    //   shade.display();
    // }

    if (displayTala && showTala.checked()) {
      for (var i = 0; i < talaCircle.strokeCircles.length; i++) {
        talaCircle.strokeCircles[i].display();
      }
      for (var i = 0; i < talaCircle.icons.length; i++) {
        talaCircle.icons[i].display();
      }
    }

    if (showCursor.checked()) {
      talaCursor.update();
      talaCursor.display();
    }
    //   var talToDraw = talCircles[currentTal];
    //   for (var i = 0; i < talToDraw.strokeCircles.length; i++) {
    //     talToDraw.strokeCircles[i].display();
    //   }
    //   if (showTheka.checked()) {
    //     for (var i = 0; i < talToDraw.strokeCircles.length; i++) {
    //       talToDraw.strokeCircles[i].displayTheka();
    //     }
    //     for (var i = 0; i < talToDraw.icons.length; i++) {
    //       talToDraw.icons[i].display();
    //     }
    //   }
    // }
    // talCursor.update();
    // talCursor.display();
  } else {
    charger.update();
    charger.display();
    talaCursor.loadingUpdate();
    talaCursor.display();
  }

  pop();

  if (displayTala && showTala.checked()) {
    textAlign(CENTER, CENTER);
    textSize(20);
    textStyle(NORMAL);
    stroke(backColor);
    strokeWeight(5);
    fill(frontColor);
    text(talName, talX, talY);
  }

  // for (var i = 0; i < talBoxes.length; i++) {
  //   talBoxes[i].display();
  // }

  textAlign(RIGHT, BOTTOM);
  textSize(12);
  textStyle(NORMAL);
  noStroke();
  fill(frontColor);
  text(apmTxt, extraSpaceW + margin + 65, navBox.y1 - margin/2);

  navBox.displayFront();
}

function start () {
  if (loaded) {
    track.stop();
  }
  paused = true;
  loaded = false;
  currentTime = 0;
  secBoxes = [];
  talaCircle;
  // talName = undefined;
  samaList = [];
  displayTala = false;
  // currentTal = undefined;
  svaraList = [];
  soundList = {};
  charger.angle = undefined;
  apmTxt = undefined;

  var currentRecording = recordingsInfo[recordingsList[selectMenu.value()].mbid];
  trackFile = currentRecording.info.trackFile;
  var raga = ragaInfo[currentRecording.raga.name];
  var sa = currentRecording.raga.sa;
  // var intonation = currentRecording.raga.intonation;
  ragName = "Rāga " + raga.name;
  artist = currentRecording.info.artist;
  link = currentRecording.info.link;
  infoLink.attribute("href", link)
    .html("+info");
  trackDuration = currentRecording.info.duration;
  pitchSpace = raga.pitchSpace;
  var key;
  var keyIndex = 0;
  for (var i = 0; i < pitchSpace.length; i++) {
    var svaraName = pitchSpace[i];
    // var svaraIndex = svaras.search(svaraName);
    var cents = svaras[svaraName]
    if (cents >= 500) {
      // var peak = intonation[svaraName+"0"];
      // if (peak != undefined) {
      //   key = octave0[keyIndex];
      //   createSound(cents, sa, key);
      //   keyIndex++
      // } else {
      //   key = "";
      // }
      cents = cents - 1200;
      key = octave0[keyIndex];
      createSound(cents, sa, key);
      var svara = new CreateSvara(svaraName, cents, key);
      svaraList.push(svara);
      keyIndex++;
    }
  }
  var keyIndex = 0;
  for (var i = 0; i < pitchSpace.length; i++) {
    var svaraName = pitchSpace[i];
    var cents = svaras[svaraName];
    // var peak = intonation[svaraName+"1"];
    // if (peak != undefined) {
    //   key = octave1[keyIndex];
    //   createSound(cents, sa, key);
    //   keyIndex++
    // } else {
    //   key = "";
    // }
    key = octave1[keyIndex];
    createSound(cents, sa, key);
    var svara = new CreateSvara(svaraName, cents, key);
    svaraList.push(svara);
    keyIndex++;
  }
  var keyIndex = 0;
  for (var i = 0; i < pitchSpace.length; i++) {
    var svaraName = pitchSpace[i];
    // var svaraIndex = svaras.search(svaraName);
    var cents = svaras[svaraName];
    if (cents <= 700) {
      // var cents = svaraIndex * 100 + 1200;
      // var peak = intonation[svaraName+"2"];
      // if (peak != undefined) {
      //   key = octave2[keyIndex];
      //   createSound(cents, sa, key);
      //   keyIndex++;
      // } else {
      //   key = "";
      // }
      cents = cents + 1200;
      key = octave2[keyIndex];
      createSound(cents, sa, key);
      var svara = new CreateSvara(svaraName, cents, key);
      svaraList.push(svara);
      keyIndex++;
    }
  }
  pitchTrack = loadJSON('../files/pitchTracks/'+recordingsList[selectMenu.value()].mbid+'_pitchTrack.json');
  // for (var i = 0; i < currentRecording.tala.length; i++) {
  //   var tal = currentRecording.talList[i];
  //   talList[tal.tal] = {
  //     "start": tal.start,
  //     "end": tal.end,
  //     "sam": tal.sam
  //   }
  //   samaList = samaList.concat(tal.sam);
  //   var talBox = new CreateTalBox(tal);
  //   talBoxes.push(talBox);
  //   var talCircle = new CreateTalCircle(talBox.tal);
  //   talCircles[tal.tal] = talCircle;
  // }
  recTala = currentRecording.tala;
  samaList = recTala.sama;
  talaCircle = new CreateTalaCircle(recTala.name);
  currentAvartana = new CreateCurrentAvartana();
  // shade = new CreateShade();
  clock = new CreateClock;
  showTala.attribute("disabled", "true");
  showTala.attribute("style", "color:rgba(120, 0, 0, 0.5);");
  showTala.checked("true");
  showCursor.attribute("disabled", "true");
  showCursor.attribute("style", "color:rgba(120, 0, 0, 0.5);");
  showCursor.checked("true");
  buttonPlay.html(lang_load);
  buttonPlay.removeAttribute("disabled");
}

function CreateNavigationBox () {
  this.x1 = extraSpaceW + margin;
  this.x2 = width - margin;
  this.y1 = height - margin - navBoxH;
  this.y2 = height - margin;
  this.w = this.x2 - this.x1;

  this.displayBack = function () {
    fill(0, 50);
    noStroke();
    rect(this.x1, this.y1, this.w, navBoxH);
    for (var i = 0; i < samaList.length; i++) {
      stroke(255);
      strokeWeight(1);
      var samX = map(samaList[i], 0, trackDuration, this.x1+navCursorW/2, this.x2-navCursorW/2);
      line(samX, this.y1, samX, this.y2);
    }
  }

  this.displayFront = function () {
    stroke(0, 150);
    strokeWeight(2);
    line(this.x1+1, this.y1, this.x2, this.y1);
    line(this.x2, this.y1, this.x2, this.y2);
    strokeWeight(1);
    line(this.x1, this.y1, this.x1, this.y2);
    line(this.x1, this.y2, this.x2, this.y2);
  }

  this.clicked = function () {
    if (mouseX > this.x1 && mouseX < this.x2 && mouseY > this.y1 && mouseY < this.y2) {
      jump = map(mouseX, this.x1, this.x2, 0, trackDuration);
      if (paused) {
        currentTime = jump;
      } else {
        track.jump(jump);
        jump = undefined;
      }
    }
  }
}

// function CreateNavCursor () {
//   this.x = navBox.x1 + navCursorW/2;
//
//   this.update = function () {
//     this.x = map(currentTime, 0, trackDuration, navBox.x1+navCursorW/2, navBox.x2-navCursorW/2);
//     var noTal = true;
//     for (var i = 0; i < talBoxes.length; i++) {
//       var talBox = talBoxes[i];
//       if (this.x > talBox.x1 && this.x < talBox.x2) {
//         talBox.on();
//         currentTal = talBox.talIndex;
//         talName = talBox.fullName;
//         noTal = false;
//       } else {
//         talBox.off();
//       }
//     }
//     if (noTal) {
//       currentTal = undefined;
//       talName = undefined;
//     }
//     if (navBox.x2 - navCursorW/2 - this.x < 0.1) {
//       buttonPlay.html(lang_start);
//       track.stop();
//       paused = true;
//       currentTime = 0;
//     }
//   }
//
//   this.display = function () {
//     stroke(frontColor);
//     strokeWeight(navCursorW);
//     line(this.x, navBox.y1+navCursorW/2, this.x, navBox.y2-navCursorW/2);
//   }
// }

function CreateNavCursor () {
  this.x = navBox.x1 + navCursorW/2;

  this.update = function () {
    this.x = map(currentTime, 0, trackDuration, navBox.x1 + navCursorW/2, navBox.x2 - navCursorW/2);
    var noTala = true;
    if (currentTime >= samaList[0] && currentTime <= samaList[samaList.length-1]) {
      displayTala = true;
    } else {
      displayTala = false;
    }
    // for (var i = 0; i < secBoxes.length; i++) {
    //   var secBox = secBoxes[i];
    //   if (this.x > secBox.x1 && this.x < secBox.x2) {
    //     secBox.on();
    //     currentTala = secBox.talIndex;
    //     talaName = secBox.fullName;
    //     noTala = false;
    //   } else {
    //     secBox.off();
    //   }
    // }
    // if (noTala) {
    //   currentTala = undefined;
    //   talaName = undefined;
    // }
    if (navBox.x2 - navCursorW/2 - this.x < 0.01) {
      button.html(lang_start);
      track.stop();
      paused = true;
      currentTime = 0;
    }
  }
  this.display = function () {
    stroke(mainColor);
    strokeWeight(navCursorW);
    line(this.x, navBox.y1+navCursorW/2, this.x, navBox.y2-navCursorW/2);
  }
}

// function CreateSvara (svara, cents, vadi, samvadi, key) {
//   this.x1 = melCursorX;
//   this.y = map(cents, -700, 1900, cursorBottom, cursorTop);
//   this.name = svarasDic[svara];
//   this.key = key;
//   this.function = svara.function;
//   if (svara == "S") {
//     this.radius = svaraRadius1;
//     this.extraX = 20;
//     this.col = frontColor;
//     this.strokeW = 4;
//     this.lineW = 4;
//     this.txtCol = backColor;
//   } else if (svara == vadi) {
//     this.radius = svaraRadius1;
//     this.extraX = 0;
//     this.col = backColor;
//     this.strokeW = 4;
//     this.lineW = 2;
//     this.txtCol = frontColor;
//   } else if (svara == samvadi) {
//     this.radius = svaraRadius2;
//     this.extraX = 0;
//     this.col = backColor;
//     this.strokeW = 2;
//     this.lineW = 2;
//     this.txtCol = frontColor;
//   } else {
//     this.radius = svaraRadius2;
//     this.extraX = 0;
//     this.col = color(0, 0);
//     this.strokeW = 0;
//     this.lineW = 1;
//     this.txtCol = frontColor;
//   }
//   if (svaraList.length == 0) {
//     this.position = 0;
//   } else if (svaraList[svaraList.length-1].position == 0) {
//     this.position = 1;
//   } else {
//     this.position = 0;
//   }
//   this.x2 = this.x1 + svaraLine/2 + (svaraRadius1*2 + margin) * this.position;
//
//   this.displayLines = function () {
//     stroke(frontColor);
//     strokeWeight(this.lineW);
//     line(this.x1-svaraLine/2-this.extraX, this.y, this.x2, this.y)
//   }
//
//   this.displaySvara = function () {
//     stroke(frontColor);
//     strokeWeight(this.strokeW);
//     fill(this.col);
//     ellipse(this.x2 + svaraRadius1, this.y, svaraRadius1, svaraRadius1);
//
//     textAlign(CENTER, CENTER);
//     noStroke();
//     textSize(svaraRadius1*0.9);//this.radius*0.9);
//     textStyle(BOLD);//this.txtStyle);
//     fill(this.txtCol);
//     text(this.name, this.x2 + svaraRadius1, this.y+this.radius*0.1);
//     stroke(frontColor);
//     strokeWeight(3);
//     fill(backColor);
//     textSize(svaraRadius1*0.7);
//     textStyle(NORMAL);
//     text(this.key, this.x2 + svaraRadius1 + textWidth(this.name), this.y + (svaraRadius1*0.9)/2)
//   }
// }

function CreateSvara (svara, cents, key) {
  this.x1 = melCursorX;
  this.y = map(cents, -700, 1900, cursorBottom, cursorTop);
  this.name = svara;
  this.key = key;
  this.function = svara.function;
  if (svara == "Sa") {
    this.radius = svaraRadius1;
    this.extraX = 20;
    this.col = frontColor;
    this.strokeW = 4;
    this.lineW = 4;
    this.txtCol = backColor;
  // } else if (svara == vadi) {
  //   this.radius = svaraRadius1;
  //   this.extraX = 0;
  //   this.col = backColor;
  //   this.strokeW = 4;
  //   this.lineW = 2;
  //   this.txtCol = frontColor;
  // } else if (svara == samvadi) {
  //   this.radius = svaraRadius2;
  //   this.extraX = 0;
  //   this.col = backColor;
  //   this.strokeW = 2;
  //   this.lineW = 2;
  //   this.txtCol = frontColor;
  } else {
    this.radius = svaraRadius2;
    this.extraX = 0;
    this.col = color(0, 0);
    this.strokeW = 0;
    this.lineW = 1;
    this.txtCol = frontColor;
  }
  if (svaraList.length == 0) {
    this.position = 0;
  } else if (svaraList[svaraList.length-1].position == 0) {
    this.position = 1;
  } else {
    this.position = 0;
  }
  this.x2 = this.x1 + svaraLine/2 + (svaraRadius1*2 + margin) * this.position;

  this.displayLines = function () {
    stroke(frontColor);
    strokeWeight(this.lineW);
    line(this.x1-svaraLine/2-this.extraX, this.y, this.x2, this.y)
  }

  this.displaySvara = function () {
    stroke(frontColor);
    strokeWeight(this.strokeW);
    fill(this.col);
    ellipse(this.x2 + svaraRadius1, this.y, svaraRadius1, svaraRadius1);

    textAlign(CENTER, CENTER);
    noStroke();
    textSize(svaraRadius1*0.9);//this.radius*0.9);
    textStyle(BOLD);//this.txtStyle);
    fill(this.txtCol);
    text(this.name, this.x2 + svaraRadius1, this.y+this.radius*0.1);
    stroke(frontColor);
    strokeWeight(3);
    fill(backColor);
    textSize(svaraRadius1*0.7);
    textStyle(NORMAL);
    text(this.key, this.x2 + svaraRadius1 + textWidth(this.name), this.y + (svaraRadius1*0.9)/2)
  }
}

function createSound (cents, sa, key) {
  this.pitch = sa * (2 ** (cents / 1200));
  this.osc = new p5.Oscillator();
  this.osc.setType("sawtooth");
  this.osc.freq(this.pitch);
  soundList[key] = this.osc;
}

// function CreateTalaCursor () {
//   this.x;
//   this.y;
//
//   this.update = function () {
//     this.angle = map(currentTime, currentAvartana.start, currentAvartana.end, 0, 360);
//     this.x = talaRadius * cos(this.angle);
//     this.y = talaRadius * sin(this.angle);
//   }
//
//   this.loadingUpdate = function () {
//     this.x = talaRadius * cos(charger.angle);
//     this.y = talaRadius * sin(charger.angle);
//   }
//
//   this.display = function () {
//     fill("red");
//     stroke(frontColor);
//     strokeWeight(1);
//     ellipse(this.x, this.y, 5, 5)
//   }
// }

function CreateTalaCursor () {
  this.x;
  this.y;
  this.update = function () {
    if (!(currentTime >= currentAvartana.start && currentTime <= currentAvartana.end)) {
      currentAvartana.update();
    }
    this.angle = map(currentTime, currentAvartana.start, currentAvartana.end, 0, 360);
    this.x = talaRadius * cos(this.angle);
    this.y = talaRadius * sin(this.angle);
  }
  this.loadingUpdate = function () {
    this.x = talaRadius * cos(charger.angle);
    this.y = talaRadius * sin(charger.angle);
  }
  this.display = function () {
    fill("red");
    stroke(50);
    strokeWeight(2);
    if (loaded) {
      line(0, 0, this.x, this.y);
    }
    ellipse(this.x, this.y, 5, 5);
  }
}

// function CreateShade () {
//   this.x;
//   this.y;
//   this.angle;
//   this.alpha;
//   this.col = shadeColor;
//
//   this.update = function () {
//     if (!(currentTime >= currentAvart.start && currentTime <= currentAvart.end)) {
//       currentAvart.update();
//     }
//     this.angle = map(currentTime, currentAvart.start, currentAvart.end, 0, 360);
//     this.alpha = map(this.angle, 0, 360, 0, 255);
//     this.x = talRadius * cos(this.angle);
//     this.y = talRadius * sin(this.angle);
//   }
//   this.display = function () {
//     this.col.setAlpha(this.alpha);
//     fill(this.col);
//     noStroke();
//     arc(0, 0, talRadius, talRadius, 0, this.angle);
//     stroke(frontColor);
//     strokeWeight(1);
//     line(0, 0, this.x, this.y);
//   }
// }

// function CreateCurrentAvart () {
//   this.index;
//   this.tal;
//   this.sam;
//   this.start;
//   this.end;
//   this.findIndex = function () {
//     while (currentTime > this.sam[this.index+1]) {
//       this.index++;
//     }
//     while (currentTime < this.sam[this.index]) {
//       this.index--;
//     }
//   }
//   this.update = function () {
//     if (currentTal == undefined) {
//       this.start = undefined;
//       this.end = undefined;
//       mpmTxt = undefined;
//     } else {
//       if (this.tal == currentTal) {
//         this.findIndex();
//       } else {
//         this.tal = currentTal
//         this.sam = talList[this.tal].sam;
//         this.index = 0;
//         this.findIndex();
//       }
//       this.start = this.sam[this.index];
//       this.end = this.sam[this.index+1];
//       var mpm = 60 / ((this.end - this.start) / talInfo[currentTal].avart);
//       mpmTxt = str(mpm.toFixed(1)) + " mpm"
//     }
//   }
// }

function CreateCurrentAvartana () {
  this.index;
  this.start;
  this.end;
  this.findIndex = function () {
    while (currentTime > samaList[this.index+1]) {
      this.index++;
    }
    while (currentTime < samaList[this.index]) {
      this.index--;
    }
  }
  this.update = function () {
    if (displayTala) {
      if (this.start == undefined) {
        this.index = 0;
        this.findIndex();
      } else {
        this.findIndex();
      }
      this.start = samaList[this.index];
      this.end = samaList[this.index+1];
      var apm = 60 / ((this.end - this.start) / talaInfo[recTala.name].avartana);
      apmTxt = str(apm.toFixed(1)) + " apm"
    } else {
      this.start = undefined;
      this.end = undefined;
      apmTxt = undefined;
    }
  }
}

// function CreateTalCircle (tal) {
//   this.strokeCircles = [];
//   this.icons = [];
//   this.avart;
//
//   var tal = talInfo[tal];
//   this.avart = tal.avart;
//   var theka = tal.theka;
//   for (var i = 0; i < theka.length; i++) {
//     var stroke = theka[i];
//     var matra = stroke.matra;
//     var vibhag; //tali or khali
//     if (int(stroke.vibhag) > 0) {
//       vibhag = "tali";
//     } else {
//       vibhag = "khali";
//     }
//     var circleType;
//     if (i == 0) {
//       circleType = "sam";
//       var icon = new CreateIcon(matra, vibhag, this.avart);
//       this.icons.push(icon);
//     } else if ((stroke.vibhag % 1) < 0.101) {
//       circleType = 1;
//       var icon = new CreateIcon(matra, vibhag, this.avart);
//       this.icons.push(icon);
//     } else if ((stroke.vibhag * 10 % 1) == 0) {
//       circleType = 2;
//     } else {
//       circleType = 3;
//     }
//     var bol = stroke.bol;
//     var strokeCircle = new CreateStrokeCircle(matra, vibhag, circleType, bol, this.avart);
//     this.strokeCircles.push(strokeCircle);
//   }
// }

function CreateTalaCircle (tala) {
  this.strokeCircles = [];
  this.icons = [];
  this.avartana;

  var tala = talaInfo[tala];
  this.avartana = tala.avartana;
  var tempoInit = tala.tempoInit;
  var theka = tala.theka[0];
  for (var i = 0; i < theka.length; i++) {
    var stroke = theka[i];
    var aksara = stroke.aksara;
    var hand = stroke.hand;
    var tk; //tali or khali
    if ((stroke.anga * 10) % 10 == 1) {
      tk = "tali";
    } else {
      tk = "khali";
    }
    var circleType;
    if (i == 0) {
      circleType = "sama";
    } else if ((stroke["anga"] % 1) < 0.101) {
      circleType = 1;
    } else if ((stroke["anga"] * 10 % 1) == 0) {
      circleType = 2;
    } else {
      circleType = 3;
    }
    if (hand == "c" || hand == "w") {
      var icon = new CreateIcon(aksara, hand, circleType, this.avartana);
      this.icons.push(icon);
    }
    var solkattu = stroke["solkattu"];
    var strokeCircle = new CreateStrokeCircle(aksara, tk, circleType, this.avartana);
    this.strokeCircles[i] = strokeCircle;
  }
}

// function CreateStrokeCircle (matra, vibhag, circleType, bol, avart) {
//   this.bol = bol;
//   var increment = 1;
//   this.strokeWeight = 2;
//   this.txtW = 0;
//
//   if (circleType == "sam") {
//     if (vibhag == "tali") {
//       this.col = frontColor;
//       this.txtCol = backColor;
//     } else {
//       this.col = backColor;
//       this.txtCol = frontColor;
//     }
//   } else if (vibhag == "tali") {
//     this.col = frontColor;
//     this.txtCol = backColor;
//   } else if (vibhag == "khali") {
//     this.col = backColor;
//     this.txtCol = frontColor;
//   }
//
//   if (circleType == "sam") {
//     this.radius = strokeRadius1;
//     this.txtSize = strokeRadius1 * 0.7;
//     this.txtStyle = BOLD;
//     this.bol = this.bol.toUpperCase();
//   } else if (circleType == 1) {
//     this.radius = strokeRadius1;
//     this.txtSize = strokeRadius1 * 0.75;
//     this.txtStyle = BOLD;
//   } else if (circleType == 2){
//     this.radius = strokeRadius2;
//     this.txtSize = strokeRadius2 * 0.75;
//     this.txtStyle = BOLD;
//   } else {
//     this.radius = strokeRadius2;
//     this.txtSize = strokeRadius2 * 0.75;
//     this.col = color(0, 0);
//     this.txtCol = frontColor;
//     this.txtStyle = NORMAL;
//     this.strokeWeight = 0;
//     this.txtW = 1;
//     increment = 1.05;
//   }
//
//   this.circleAngle = map(matra, 0, avart, 0, 360);
//   this.x = talRadius * increment * cos(this.circleAngle);
//   this.y = talRadius * increment * sin(this.circleAngle);
//
//   this.display = function () {
//     push();
//     translate(this.x, this.y);
//     stroke(frontColor);
//     strokeWeight(this.strokeWeight);
//     fill(this.col);
//     ellipse(0, 0, this.radius, this.radius);
//     pop();
//   }
//
//   this.displayTheka = function () {
//     push();
//     translate(this.x, this.y);
//     textAlign(CENTER, CENTER);
//     stroke(backColor);
//     strokeWeight(this.txtW);
//     fill(this.txtCol);
//     textSize(this.txtSize);
//     textStyle(this.txtStyle);
//     rotate(90);
//     text(this.bol, 0, 0);
//     pop();
//   }
// }

function CreateStrokeCircle (aksara, tk, circleType, avartana) {
  var increment = 1;
  this.strokeWeight = 2;
  this.txtW = 0;

  if (circleType == "sama") {
    if (tk == "tali") {
      this.col = frontColor;
    } else {
      this.col = backColor;
    }
  } else if (tk == "tali") {
    this.col = frontColor;
  } else if (tk == "khali") {
    this.col = backColor;
  }

  if (circleType == "sama") {
    this.radius = radius1 * 1.2;
  // } else if (circleType == 1) {
  //   this.radius = radius1;
  // } else if (circleType == 2){
  //   this.radius = radius2;
  // } else {
  //   this.radius = radius2;
  //   this.col = color(0, 0);
  //   this.strokeWeight = 0;
  //   increment = 1.05;
  // }
  } else {
    this.radius = radius1;
  }

  this.circleAngle = map(aksara, 0, avartana, 0, 360);
  this.x = talaRadius * increment * cos(this.circleAngle);
  this.y = talaRadius * increment * sin(this.circleAngle);

  this.display = function () {
    push();
    translate(this.x, this.y);
    stroke(frontColor);
    strokeWeight(this.strokeWeight);
    fill(this.col);
    ellipse(0, 0, this.radius, this.radius);
    pop();
  }
}

// function CreateIcon (matra, vibhag, avart) {
//   this.circleAngle = map(matra, 0, avart, 0, 360);
//   this.x = talRadius * iconDistance * cos(this.circleAngle);
//   this.y = talRadius * iconDistance * sin(this.circleAngle);
//   if (vibhag == "tali") {
//     this.img = clap;
//   } else if (vibhag == "khali") {
//     this.img = wave;
//   }
//
//   this.display = function () {
//     push();
//     translate(this.x, this.y);
//     rotate(90);
//     image(this.img, 0, 0, strokeRadius2*2, strokeRadius2*2);
//     pop();
//   }
// }

function CreateIcon (aksara, hand, circleType, avartana) {
  this.circleAngle = map(aksara, 0, avartana, 0, 360);
  this.x = talaRadius * iconDistance * cos(this.circleAngle);
  this.y = talaRadius * iconDistance * sin(this.circleAngle);
  // this.x = talaRadius * cos(this.circleAngle);
  // this.y = talaRadius * sin(this.circleAngle);
  if (circleType == 0) {
    this.size = radius1*1.2*1.5;
  } else {
    this.size = radius1*1.5;
  }
  if (hand == "c") {
    this.img = clap;
  } else if (hand == "w") {
    this.img = wave;
  }

  this.display = function () {
    push();
    translate(this.x, this.y);
    rotate(90);
    image(this.img, 0, 0, this.size, this.size);
    pop();
  }
}

function CreateTalBox (tal) {
  if (tal.tal[tal.tal.length-1] == 'l') {
    this.tal = tal.tal;
  } else {
    this.tal = tal.tal.slice(0, tal.tal.length-1);
  }
  this.talIndex = tal.tal;
  this.name = talInfo[this.tal].nameTrans;
  this.fullName = talInfo[this.tal].name + "\n" + this.name;
  this.h = 25;
  this.x1 = map(tal.start, 0, trackDuration, navBox.x1+navCursorW/2, navBox.x2-navCursorW/2);
  this.x2 = map(tal.end, 0, trackDuration, navBox.x1+navCursorW/2, navBox.x2-navCursorW/2);
  this.w = this.x2-this.x1;
  this.boxCol = color(255, 100);
  this.txtBorder = 0;
  this.txtCol = color(75);
  this.txtStyle = NORMAL;
  this.currentSamIndex = 0;

  this.off = function () {
    this.boxCol = color(255, 100);
    this.txtCol = color(75);
    this.txtBorder = 0;
    this.txtStyle = NORMAL;
  }

  this.on = function () {
    this.boxCol = backColorTrans;
    this.txtCol = color(255);
    this.txtBorder = 2;
    this.txtStyle = NORMAL;
  }

  this.display = function () {
    fill(this.boxCol);
    noStroke();
    rect(this.x1, navBox.y1, this.w, this.h);
    textAlign(LEFT, BOTTOM);
    textSize(this.h * 0.7);
    fill(this.txtCol);
    textStyle(this.txtStyle);
    stroke(0);
    strokeWeight(this.txtBorder);
    text(this.name, this.x1+2, navBox.y1 + this.h*0.92);
  }
}

function CreateClock () {
  this.clock;
  this.total = niceTime(trackDuration);
  this.now;
  this.display = function () {
    this.now = niceTime(currentTime);
    this.clock = this.now + " / " + this.total;
    textAlign(CENTER, BOTTOM);
    textSize(12);
    textStyle(NORMAL);
    noStroke();
    fill(frontColor);
    text(this.clock, extraSpaceW + mainSpace/2, navBox.y1 - margin/2);
  }
}

function player () {
  if (loaded) {
    if (paused) {
      paused = false;
      if (jump == undefined) {
        track.play();
      } else {
        track.play();
        track.jump(jump);
        jump = undefined;
      }
      buttonPlay.html(lang_pause);
    } else {
      paused = true;
      currentTime = track.currentTime();
      track.pause();
      buttonPlay.html(lang_continue);
    }
  } else {
    initLoading = millis();
    buttonPlay.html(lang_loading);
    buttonPlay.attribute("disabled", "true");
    selectMenu.attribute("disabled", "true");
    charger.angle = 0;
    track = loadSound("../tracks/" + trackFile, soundLoaded, failedLoad);
  }
}

function CreateCharger () {
  this.angle;
  this.update = function () {
    this.angle += 1;
  }
  this.display = function () {
    stroke(frontColor);
    strokeWeight(2);
    noFill();
    arc(0, 0, talaRadius, talaRadius, 0, this.angle);
  }
}

function soundLoaded () {
  buttonPlay.html(lang_start);
  buttonPlay.removeAttribute("disabled");
  selectMenu.removeAttribute("disabled");
  loaded = true;
  // showTheka.removeAttribute("disabled");
  // showTheka.attribute("style", "color:rgba(120, 0, 0);");
  showTala.removeAttribute("disabled");
  showTala.attribute("style", "color:rgba(120, 0, 0);");
  showCursor.removeAttribute("disabled");
  showCursor.attribute("style", "color:rgba(120, 0, 0);");
  var endLoading = millis();
  print("Track loaded in " + (endLoading-initLoading)/1000 + " seconds");
}

function failedLoad () {
  print("Loading failed");
  failedLoading = true;
  charger.angle = undefined;
}

function mouseClicked () {
  if (loaded) {
    navBox.clicked();
  }
}

function keyPressed () {
  soundList[key.toLowerCase()].start();
}

function keyReleased () {
  soundList[key.toLowerCase()].stop();
}

function niceTime (seconds) {
  var niceTime;
  var sec = int(seconds%60);
  var min = int(seconds/60);
  niceTime = str(min).padStart(2, "0") + ":" + str(sec).padStart(2, "0");
  return niceTime
}
