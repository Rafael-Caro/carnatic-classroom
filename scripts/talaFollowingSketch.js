//general variables
var talaInfo;
var recordingsInfo;
var recordingsList;
var recTala = {};
var failedLoading = false;
//tala features
// var talaName;
var title;
var artist;
var link;
var trackFile;
// var avartana;
// var strokeCircles = []; //list of strokeCircles
var talaCircle;
var displayTala;
var currentAvartana;
var currentTime = 0;
var charger;
var clock;
var apmTxt;
var samaList = [];
//style
var radiusBig; //radius of the big circle
var radius1 = 25; //radius of accented aksara
var radius2 = 17; //radius of unaccented aksara
var cursorRadius = 7;
var backColor;
var mainColor;
var aksaraColor;
//machanism
var speed;
var tempo;
// var cursorX; //cursor line's x
// var cursorY; //cursor line's y
// var angle = -90; //angle of the cursor
var navCursor;
var navCursorW = 5;
var cursor;
var shade;
var jump;
// var alpha;
// var position = 0;
var paused = true;
//html interaction
var selectMenu;
var button;//sounds
var showCursor;
var showTala;
var loaded = false;
var margin = 10;
var navBoxH = 60;
var navBox;
// var secBoxes = [];
var talaBox;
var infoLink;
// Sounds
var trackDuration;
var track;
var initLoading;
// Icons
var wave;
var clap;
// var iconSamaSize = radius1*1.7;
// var iconSize = radius2*1.7;
var iconDistance = 0.68;
// var icons = [];
// Language
var lang_select;
var lang_load;
var lang_error;
var lang_start;
var lang_pause;
var lang_continue;
var lang_loading;

function preload () {
  recordingsList = loadJSON("../files/talaFollowing-recordingsList.json");
  recordingsInfo = loadJSON("../files/recordingsInfo.json");
  talaInfo = loadJSON("../files/talaInfo.json");
  wave = loadImage("../images/wave.svg");
  clap = loadImage("../images/clap.svg");
}

function setup() {
  var canvas = createCanvas(600, 600);
  var div = select("#sketch-holder");
  div.style("width: " + width + "px; margin: 10px auto; position: relative;");
  // var divElem = new p5.Element(input.elt);
  // divElem.style
  canvas.parent("sketch-holder");
  ellipseMode(RADIUS);
  angleMode(DEGREES);
  imageMode(CENTER);
  textFont("Laila");
  strokeJoin(ROUND);
  //style
  radiusBig = width * 0.27;
  backColor = color(185, 239, 162);
  mainColor = color(249, 134, 50);
  aksaraColor = color(249, 175, 120);

  charger = new CreateCharger();
  cursor = new CreateCursor();
  navBox = new CreateNavigationBox();

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

  //html interaction
  infoLink = select("#info-link");
  infoLink.position(width-60, margin*3+37);
  button = createButton(lang_load)
    .size(120, 25)
    .position(width-120-margin, navBox.y1 - margin/2 - 25)
    .mousePressed(player)
    .parent("sketch-holder")
    .attribute("disabled", "true");
  selectMenu = createSelect()
    .size(100, 20)
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
  showCursor = createCheckbox(' cursor', true)
    .position(margin, 90)
    .parent("sketch-holder");
  showTala = createCheckbox(' tāla', true)
    .position(margin, showCursor.position()["y"]+showCursor.height+margin/2)
    .parent("sketch-holder");
  showCursor.attribute("disabled", "true");
  showCursor.attribute("style", "color:rgba(0, 0, 0, 0.4);");
  showTala.attribute("disabled", "true");
  showTala.attribute("style", "color:rgba(0, 0, 0, 0.4);");
}

function draw() {
  background(backColor);

  stroke(0, 50);
  strokeWeight(1);
  line(margin*2, margin*3+27, width-margin*2, margin*3+27);

  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(30);
  strokeWeight(5);
  stroke(0);
  mainColor.setAlpha(255);
  fill(mainColor);
  text(title, width/2, margin*3);
  textAlign(CENTER, CENTER);
  stroke(0, 150);
  strokeWeight(1);
  textSize(20);
  fill(0, 150);
  text(artist, width/2, margin*3+45);

  if (!paused) {
    currentTime = track.currentTime();
  }

  push();
  translate(width/2, height/2);

  if (failedLoading) {
    textAlign(CENTER, CENTER);
    textSize(15)
    noStroke()
    fill(0)
    text(lang_error, 0, 0);
  }

  rotate(-90);

  // noStroke();
  // alpha = map((angle+90)%360, 0, 360, 0, 255);
  // mainColor.setAlpha(alpha);
  // fill(mainColor);
  // arc(0, 0, radiusBig, radiusBig, -90, angle%360);

  if (loaded) {
    noFill();
    strokeWeight(2);
    mainColor.setAlpha(255);
    stroke(mainColor);
    ellipse(0, 0, radiusBig, radiusBig);
    //draw circle per solkattu
    if (displayTala && showTala.checked()) {
      for (var i = 0; i < talaCircle.strokeCircles.length; i++) {
        talaCircle.strokeCircles[i].display();
      }
      for (var i = 0; i < talaCircle.icons.length; i++) {
        talaCircle.icons[i].display();
      }
    }

    if (showCursor.checked()) {
      cursor.update();
      cursor.display();
    }
  } else {
    charger.update();
    charger.display();
    cursor.loadingUpdate();
    cursor.display();
  }

  pop();

  if (displayTala && showTala.checked()) {
    textAlign(CENTER, CENTER);
    textSize(25);
    strokeWeight(5);
    stroke(0);
    mainColor.setAlpha(255);
    fill(mainColor);
    textStyle(NORMAL);
    text(talaInfo[recTala.name]["name"], width/2, height/2);
  }

  navBox.displayBack();

  if (loaded) {
    navCursor.update();
    navCursor.display();
    // for (var i = 0; i < secBoxes.length; i++) {
    //   secBoxes[i].update();
    // }
    clock.display();
  }

  // for (var i = 0; i < secBoxes.length; i++) {
  //   secBoxes[i].display();
  // }
  if (talaBox != undefined) {
    talaBox.display();
  }
  navBox.displayFront();

  textAlign(RIGHT, BOTTOM);
  textSize(12);
  textStyle(NORMAL);
  noStroke();
  fill(50);
  text(apmTxt, margin + 65, navBox.y1-margin/2);

  // position = updateCursor(position);

  //cursor
  // stroke(mainColor);
  // line(0, 0, cursorX, cursorY);
  // fill("red");
  // noStroke();
  // ellipse(cursorX, cursorY, 5, 5);
}

function start () {
  if (loaded) {
    track.stop();
  }
  loaded = false;
  paused = true;
  currentTime = 0;
  // secBoxes = [];
  talaBox;
  talaCircle;
  samaList = [];
  displayTala = false;
  charger.angle = undefined;
  apmTxt = undefined;
  var currentRecording = recordingsInfo[recordingsList[selectMenu.value()].mbid];
  trackDuration = currentRecording.info.duration;
  title = currentRecording.info.title;
  artist = currentRecording.info.artist;
  link = currentRecording.info.link;
  infoLink.attribute("href", link)
    .html("+info");
  trackFile = currentRecording.info.trackFile;
  navCursor = new CreateNavCursor();
  recTala = currentRecording.tala;
  samaList = recTala.sama;
  talaBox = new CreateTalaBox(recTala);
  // secBoxes.push(secBox);
  talaCircle = new CreateTalaCircle(recTala.name);
  currentAvartana = new CreateCurrentAvartana();
  // shade = new CreateShade();
  clock = new CreateClock();
  showCursor.attribute("disabled", "true");
  showCursor.attribute("style", "color:rgba(0, 0, 0, 0.4);");
  showCursor.checked("true");
  showTala.attribute("disabled", "true");
  showTala.attribute("style", "color:rgba(0, 0, 0, 0.4);");
  showTala.checked("true");
  button.html(lang_load);
  button.removeAttribute("disabled");
}

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
    // } else if ((stroke["anga"] % 1) < 0.101) {
    //   circleType = 1;
    // } else if ((stroke["anga"] * 10 % 1) == 0) {
    //   circleType = 2;
    } else if (hand != "") {
      circleType = 1;
    // } else if (hand == "") {
    //   circleType = 2;
    } else {
      circleType = 2;
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

function CreateStrokeCircle (aksara, tk, circleType, avartana) {
  var increment = 1;
  this.strokeWeight = 2;
  this.txtW = 0;

  if (circleType == "sama") {
    if (tk == "tali") {
      this.col = mainColor;
    } else {
      this.col = backColor;
    }
  } else if (tk == "tali") {
    this.col = aksaraColor;
  } else if (tk == "khali") {
    this.col = backColor;
  }

  if (circleType == "sama") {
    this.radius = radius1 * 1.2;
  } else if (circleType == 1) {
    this.radius = radius1;
  } else if (circleType == 2){
    this.radius = radius2 * 0.6;
  // } else {
  //   this.radius = radius2;
  //   this.col = color(0, 0);
  //   this.strokeWeight = 0;
  //   increment = 1.05;
  }

  this.circleAngle = map(aksara, 0, avartana, 0, 360);
  this.x = radiusBig * increment * cos(this.circleAngle);
  this.y = radiusBig * increment * sin(this.circleAngle);

  this.display = function () {
    push();
    translate(this.x, this.y);
    stroke(mainColor);
    strokeWeight(this.strokeWeight);
    fill(this.col);
    ellipse(0, 0, this.radius, this.radius);
    pop();
  }
}

function CreateNavigationBox () {
  this.x1 = margin;
  this.x2 = width - margin;
  this.y1 = height - navBoxH - margin;
  this.y2 = height - margin;
  this.w = this.x2 - this.x1;

  this.displayBack = function () {
    fill(0, 50);
    noStroke();
    rect(margin, navBox.y1, this.w, navBoxH);
    for (var i = 0; i < samaList.length; i++) {
      stroke(255);
      strokeWeight(1);
      var samaX = map(samaList[i], 0, trackDuration, this.x1+navCursorW/2, this.x2-navCursorW/2);
      line(samaX, this.y1, samaX, this.y2);
    }
  }

  this.displayFront = function () {
    stroke(0, 150);
    strokeWeight(2);
    line(this.x1+1, navBox.y1, this.x2, navBox.y1);
    line(this.x2, navBox.y1, this.x2, navBox.y2);
    strokeWeight(1);
    line(this.x1, navBox.y1, this.x1, navBox.y2);
    line(this.x1, navBox.y2, this.x2, navBox.y2);
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

function CreateTalaBox (recTala) {
  // if (tala.tala[tala.tala.length-1] == 'l') {
  //   this.tala = tala.tala;
  // } else {
  //   this.tala = tala.tala.slice(0, tala.tala.length-1);
  // }
  // this.talaIndex = tala.tala;
  this.name = talaInfo[recTala.name].name;
  // this.fullName = talaInfo[this.tala].name + "\n" + this.name;
  this.h = 25;
  this.x1 = map(recTala.start, 0, trackDuration, navBox.x1+navCursorW/2, navBox.x2-navCursorW/2);
  this.x2 = map(recTala.end, 0, trackDuration, navBox.x1+navCursorW/2, navBox.x2-navCursorW/2);
  this.w = this.x2-this.x1;
  this.boxCol = color(255, 100);
  this.txtCol = color(100);
  this.txtStyle = NORMAL;
  this.txtBorder = 0;
  // this.sama = talaList[this.talaIndex].sama;
  // this.currentSamaIndex = 0;
  this.off = function () {
    this.boxCol = color(255);
    this.txtCol = color(100);
    this.txtStyle = NORMAL;
    this.txtBorder = 0;
  }
  this.on = function () {
    this.boxCol = mainColor;
    this.txtCol = color(0);
    this.txtStyle = BOLD;
    this.txtBorder = 1;
  }

  this.display = function () {
    this.boxCol.setAlpha(100);
    fill(this.boxCol);
    noStroke();
    rect(this.x1, navBox.y1, this.w, this.h);
    textAlign(LEFT, BOTTOM);
    textSize(this.h * 0.7);
    fill(this.txtCol);
    textStyle(this.txtStyle);
    fill(0);
    mainColor.setAlpha(255);
    stroke(mainColor);
    strokeWeight(this.txtBorder);
    text(this.name, this.x1+2, navBox.y1 + this.h*0.92);
  }
}

function CreateCursor () {
  this.x;
  this.y;
  this.update = function () {
    if (!(currentTime >= currentAvartana.start && currentTime <= currentAvartana.end)) {
      currentAvartana.update();
    }
    this.angle = map(currentTime, currentAvartana.start, currentAvartana.end, 0, 360);
    this.x = radiusBig * cos(this.angle);
    this.y = radiusBig * sin(this.angle);
  }
  this.loadingUpdate = function () {
    this.x = radiusBig * cos(charger.angle);
    this.y = radiusBig * sin(charger.angle);
  }
  this.display = function () {
    fill("red");
    stroke(50);
    strokeWeight(2);
    if (loaded) {
      line(0, 0, this.x, this.y);
    }
    ellipse(this.x, this.y, cursorRadius, cursorRadius);
  }
}

// function CreateShade () {
//   this.x;
//   this.y;
//   this.angle;
//   this.alpha;
//   this.col = mainColor;
//   this.update = function () {
//     this.angle = map(currentTime, currentAvartana.start, currentAvartana.end, 0, 360);
//     this.alpha = map(this.angle, 0, 360, 0, 255);
//     this.x = radiusBig * cos(this.angle);
//     this.y = radiusBig * sin(this.angle);
//   }
//   this.display = function () {
//     this.col.setAlpha(this.alpha);
//     fill(this.col);
//     noStroke();
//     arc(0, 0, radiusBig, radiusBig, 0, this.angle);
//   }
// }

function CreateIcon (aksara, hand, circleType, avartana) {
  this.circleAngle = map(aksara, 0, avartana, 0, 360);
  // this.x = radiusBig * iconDistance * cos(this.circleAngle);
  // this.y = radiusBig * iconDistance * sin(this.circleAngle);
  this.x = radiusBig * cos(this.circleAngle);
  this.y = radiusBig * sin(this.circleAngle);
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

function CreateClock () {
  this.clock;
  this.total = niceTime(trackDuration);
  this.now;
  this.display = function() {
    this.now = niceTime(currentTime);
    this.clock = this.now + " / " + this.total;
    textAlign(CENTER, BOTTOM);
    textSize(12);
    textStyle(NORMAL);
    noStroke();
    fill(50);
    text(this.clock, width/2, navBox.y1-margin/2);
  }
}

function CreateCharger () {
  this.angle;
  this.update = function () {
    // if (this.angle == undefined) {
    //   this.angle = 0;
    // } else {
    //   this.angle += 6;
    // }
    this.angle += 1;
  }
  this.display = function () {
    stroke(mainColor);
    strokeWeight(2);
    noFill();
    arc(0, 0, radiusBig, radiusBig, 0, this.angle);
  }
}

function player() {
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
      button.html(lang_pause);
    } else {
      paused = true;
      currentTime = track.currentTime();
      track.pause();
      button.html(lang_continue);
    }
  } else {
    initLoading = millis();
    button.html(lang_loading);
    button.attribute("disabled", "true");
    selectMenu.attribute("disabled", "true");
    charger.angle = 0;
    track = loadSound("../tracks/" + trackFile, soundLoaded, failedLoad);
  }
}

function soundLoaded () {
  button.html(lang_start);
  button.removeAttribute("disabled");
  selectMenu.removeAttribute("disabled");
  loaded = true;
  showCursor.removeAttribute("disabled");
  showCursor.attribute("style", "color:rgba(0, 0, 0, 0.6);");
  showTala.removeAttribute("disabled");
  showTala.attribute("style", "color:rgba(0, 0, 0, 0.6);");
  var endLoading = millis();
  print("Track loaded in " + (endLoading-initLoading)/1000 + " seconds");
}

function failedLoad () {
  print("Loading failed");
  failedLoading = true;
  charger.angle = undefined;
}

function mousePressed () {
  // if (loaded && track.isPlaying()) {
  //   for (var i = 0; i < strokeCircles.length; i++) {
  //     strokeCircles[i].clicked();
  //   }
  // }
  if (loaded) {
    navBox.clicked();
  }
}

function niceTime (seconds) {
  var niceTime;
  var sec = int(seconds%60);
  var min = int(seconds/60);
  niceTime = str(min).padStart(2, "0") + ":" + str(sec).padStart(2, "0");
  return niceTime
}
