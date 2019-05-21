//general variables
var talaInfo;
var talaMenu; // = ["tīntāl", "ektāl", "jhaptāl", "rūpak tāl"];
//tala features
var talaName;
var avartana;
var strokeCircles = []; //list of strokeCircles
//style
var radiusBig; //radius of the big circle
var radius1 = 27; //radius of accented aksara
var radius2 = 20; //radius of unaccented aksara
var backColor;
var mainColor;
var aksaraColor;
//machanism
var speed;
var tempo;
// var cursorX; //cursor line's x
// var cursorY; //cursor line's y
// var angle = -90; //angle of the cursor
var currentTheka;
var cursor;
var cursorRadius = 7;
// var shade;
// var alpha;
// var position = 0;
var playing = false;
var timeDiff;
//html interaction
var slider;
var select;
var button;//sounds
var thekaMenu;
var showCursor;
var showTala;
var loaded = false;
// Sound
var cha;
var dheem;
var dhin;
var num;
var ta;
var tha;
var tham;
var thi;
var thom;
var soundDic = {};
var strokeToPlay = 0;
// Icons
var wave;
var clap;
var iconSamaSize = radius1*1.7;
var iconSize = radius2*1.7;
var iconDistance = 0.72;
var icons = [];
// language
var lang_select;
var lang_start;
var lang_stop;

function preload () {
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
  //style
  radiusBig = width * (1 / 3);
  backColor = color(185, 239, 162);
  mainColor = color(249, 134, 50);
  aksaraColor = color(249, 175, 120);
  //language
  var lang = select("html").elt.lang;
  if (lang == "en") {
    lang_select = "Select a tāl";
    lang_start = "Start!";
    lang_stop = "Stop";
  } else if (lang == "es") {
    lang_select = "Elige un tāl";
    lang_start = "¡Comienza!";
    lang_stop = "Para";
  }
  //html interaction
  slider = createSlider(5, 300)
    .position(10, height-30)
    .size(width-20, 20)
    .changed(updateTempo)
    .parent("sketch-holder");
  select = createSelect()
    .size(100, 25)
    .position(10, 10)
    .changed(start)
    .parent("sketch-holder");
  select.option(lang_select);
  var noTala = select.child();
  // print(noTal[0]);
  noTala[0].setAttribute("selected", "true");
  noTala[0].setAttribute("disabled", "true");
  noTala[0].setAttribute("hidden", "true");
  noTala[0].setAttribute("style", "display: none");
  talaMenu = Object.keys(talaInfo);
  for (var i = 0; i < talaMenu.length; i++) {
    select.option(talaInfo[talaMenu[i]].name + " (" + talaInfo[talaMenu[i]].avartana + ")", i);
  }
  showCursor = createCheckbox(' cursor', true)
    .position(10, 90)
    .parent("sketch-holder");
  showTala = createCheckbox(' tāl', true)
    .position(10, showCursor.position()["y"]+showCursor.height+5)
    .changed(function() {
      showTheka.checked(showTala.checked());
    })
    .parent("sketch-holder");
  showCursor.attribute("disabled", "true");
  showCursor.attribute("style", "color:rgba(0, 0, 0, 0.4);");
  showTala.attribute("disabled", "true");
  showTala.attribute("style", "color:rgba(0, 0, 0, 0.4);");
  button = createButton(lang_start)
    .size(90, 25)
    .position(width-100, 10)
    .mousePressed(playTala)
    .parent("sketch-holder")
    .attribute("disabled", "true");
    // .style("position: static;");
  //start tala
  // start();
  // updateTempo();
}

function draw() {
  background(backColor);
  translate(width/2, height/2);
  tempo = slider.value();
  fill(0);
  noStroke();
  textAlign(LEFT, BASELINE);
  textSize(12);
  text(str(tempo)+" mpm", -width/2+10, height/2-30); //tempo box

  push();
  rotate(-90);

  // if (playing) {
  //   shade.update();
  //   if (showCursor.checked()) {
  //     shade.display();
  //   }
  // }

  noFill();
  strokeWeight(2);
  mainColor.setAlpha(255);
  stroke(mainColor);
  ellipse(0, 0, radiusBig, radiusBig);
  //draw circle per solkattu
  if (showTala.checked()) {
    if (strokeCircles.length > 0) {
      for (var i = 0; i < strokeCircles[int(thekaMenu.value())].length; i++) {
        strokeCircles[int(thekaMenu.value())][i].display();
      }
      for (var i = 0; i < strokeCircles[int(thekaMenu.value())].length; i++) {
        strokeCircles[int(thekaMenu.value())][i].displayTheka();
      }
    }
    for (var i = 0; i < icons.length; i++) {
      icons[i].display();
    }
  }

  if (playing) {
    cursor.update();
    if (showCursor.checked()) {
      cursor.display();
    }
    strokePlayer(cursor.angle);
  }
  pop();

  textAlign(CENTER, CENTER);
  textSize(30);
  strokeWeight(5);
  stroke(0);
  fill(mainColor);
  text(talaName, 0, 0);

  // position = updateCursor(position);

  //cursor
  // stroke(mainColor);
  // line(0, 0, cursorX, cursorY);
  // fill("red");
  // noStroke();
  // ellipse(cursorX, cursorY, 5, 5);
}

function start() {
  //restart values
  strokeCircles = [];
  icons = [];
  // strokePlayPoints = [];
  cursorX = 0;
  cursorY = -radiusBig;
  var angle = 0;
  button.html(lang_start);
  if (button.attribute("disabled")) {
    button.removeAttribute("disabled");
  }
  playing = false;

  var tala = talaInfo[talaMenu[select.value()]];
  talaName = tala.name;
  avartana = tala.avartana;
  var tempoInit = tala.tempoInit;
  var theka = tala.theka;
  thekaMenu = createSelect()
    .size(80, 25)
    .position(select.position()["x"] + select.width + 5, 10)
    .changed(function() {
      if (playing) {
        playing = false;
        button.html(lang_start);
      }
      currentTheka = thekaMenu.value();
    })
    .parent("sketch-holder");
  for (var i = 0; i < theka.length; i++) {
    var thisTheka = theka[i];
    var optionLabel;
    if (i == 0) {
      optionLabel = "No ṭhekā";
    } else {
      optionLabel = "Ṭhekā " + str(i);
    }
    thekaMenu.option(optionLabel, i)
    strokeCircles[i] = [];
    for (var j = 0; j < thisTheka.length; j++) {
      var stroke = thisTheka[j];
      var aksara = stroke.aksara;
      var anga; //tali or khali
      if (int(stroke.anga) > 0) {
        anga = "tali";
      } else {
        anga = "khali";
      }
      var circleType;
      if (j == 0) {
        circleType = "sama";
        var icon = new CreateIcon(aksara, anga, radius1*1.2*1.5);
        icons.push(icon);
      } else if ((stroke["anga"] % 1) < 0.101) {
        circleType = 1;
        var icon = new CreateIcon(aksara, anga, radius1*1.5);
        icons.push(icon);
      } else if ((stroke["anga"] * 10 % 1) == 0) {
        circleType = 2;
      } else {
        circleType = 3;
      }
      var solkattu = stroke["solkattu"];
      var strokeCircle = new CreateStrokeCircle(aksara, anga, circleType, solkattu);
      strokeCircles[i][j] = strokeCircle;
    }
  }
  thekaMenu.child()[0].setAttribute("selected", "true");
  slider.value(tempoInit);
  showCursor.removeAttribute("disabled");
  showCursor.attribute("style", "color:rgba(0, 0, 0, 0.6);");
  showTala.removeAttribute("disabled");
  showTala.attribute("style", "color:rgba(0, 0, 0, 0.6);");
  // showCursor.attribute("disabled", "true");
  // showCursor.attribute("style", "color:rgba(0, 0, 0, 0.4);");
  // showCursor.checked("true");
  // showTala.attribute("disabled", "true");
  // showTala.attribute("style", "color:rgba(0, 0, 0, 0.4);");
  // showTala.checked("true");
  updateTempo();
}

function CreateStrokeCircle (aksara, anga, circleType, solkattu) {
  this.solkattu = solkattu;
  this.sound = soundDic[this.solkattu]
  var increment = 1;
  this.strokeWeight = 2;
  this.txtW = 0;

  if (circleType == "sama") {
    if (anga == "tali") {
      this.col = mainColor;
    } else {
      this.col = backColor;
    }
  } else if (anga == "tali") {
    this.col = aksaraColor;
  } else if (anga == "khali") {
    this.col = backColor;
  }

  if (circleType == "sama") {
    this.radius = radius1 * 1.2;
    this.txtSize = radius1 * 0.7;
    this.txtStyle = BOLD;
    this.solkattu = this.solkattu.toUpperCase();
    this.volume = 1;
  } else if (circleType == 1) {
    this.radius = radius1;
    this.txtSize = radius1 * 0.75;
    this.txtStyle = BOLD;
    this.volume = 1;
  } else if (circleType == 2){
    this.radius = radius2;
    this.txtSize = radius2 * 0.75;
    this.txtStyle = BOLD;
    this.volume = 0.5;
  } else {
    this.radius = radius2;
    this.txtSize = radius2 * 0.75;
    this.col = color(0, 0);
    this.txtStyle = NORMAL;
    this.strokeWeight = 0;
    this.txtW = 2;
    increment = 1.05;
    this.volume = 0.5;
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

  this.displayTheka = function () {
    if (this.solkattu != "CYMBALS" && this.solkattu != "click") {
      push();
      translate(this.x, this.y);
      textAlign(CENTER, CENTER);
      stroke(backColor);
      strokeWeight(this.txtW);
      fill(0);
      textSize(this.txtSize);
      textStyle(this.txtStyle);
      rotate(90);
      text(this.solkattu, 0, 0);
      pop();
    }
  }

  this.clicked = function () {
    var x = -mouseY+height/2;
    var y = mouseX-width/2;
    var d = dist(this.x, this.y, x, y);
    if (d < this.radius) {
      soundDic[this.solkattu.toLowerCase()].play();
    }
  }
}

function CreateCursor () {
  this.x = 0;
  this.y = -radiusBig;
  this.angle = 0;
  this.position = 0;
  this.update = function () {
    var position = millis() - timeDiff;
    var increase = position - this.position;
    this.angle += (360 * increase) / speed;
    if (this.angle > 360) {
      this.angle -= 360;
    }
    this.x = radiusBig * cos(this.angle);
    this.y = radiusBig * sin(this.angle);
    this.position = position;
  }
  this.display = function () {
    fill("red");
    stroke(50);
    strokeWeight(2);
    line(0, 0, this.x, this.y);
    ellipse(this.x, this.y, cursorRadius, cursorRadius);
  }
}

// function CreateShade () {
//   this.x = 0;
//   this.y = -radiusBig;
//   this.angle = 0;
//   this.position = 0;
//   this.alpha = 0;
//   this.col = mainColor;
//   this.update = function () {
//     var position = millis() - timeDiff;
//     var increase = position - this.position;
//     this.angle += (360 * increase) / speed;
//     if (this.angle > 360) {
//       this.angle -= 360;
//     }
//     // var alphaAngle = this.angle + 90;
//     // if (alphaAngle > 360) {
//     //   alphaAngle -= 360;
//     // }
//     this.alpha = map(this.angle, 0, 360, 0, 255);
//     this.x = radiusBig * cos(this.angle);
//     this.y = radiusBig * sin(this.angle);
//     this.position = position;
//   }
//   this.display = function () {
//     this.col.setAlpha(this.alpha);
//     fill(this.col);
//     noStroke();
//     arc(0, 0, radiusBig, radiusBig, 0, this.angle);
//   }
// }

function CreateIcon (aksara, anga, size) {
  this.circleAngle = map(aksara, 0, avartana, 0, 360);
  this.x = radiusBig * iconDistance * cos(this.circleAngle);
  this.y = radiusBig * iconDistance * sin(this.circleAngle);
  if (anga == "tali") {
    this.img = clap;
  } else if (anga == "khali") {
    this.img = wave;
  }

  this.display = function () {
    push();
    translate(this.x, this.y);
    rotate(90);
    image(this.img, 0, 0, size, size);
    pop();
  }
}

function strokePlayer (angle) {
  var checkPoint = strokeCircles[int(thekaMenu.value())][strokeToPlay].circleAngle;
  var sound = strokeCircles[int(thekaMenu.value())][strokeToPlay].sound;
  if (checkPoint == 0) {
    if (angle < strokeCircles[int(thekaMenu.value())][strokeCircles.length-1].circleAngle) {
      if (sound != undefined) {
        sound.setVolume(strokeCircles[int(thekaMenu.value())][strokeToPlay].volume);
        sound.play();
      }
      strokeToPlay++;
    }
  } else {
    if (angle >= checkPoint) {
      if (sound != undefined) {
        sound.setVolume(strokeCircles[int(thekaMenu.value())][strokeToPlay].volume);
        sound.play();
      }
      strokeToPlay++;
    }
  }
  if (strokeToPlay == strokeCircles[int(thekaMenu.value())].length) {
    strokeToPlay = 0;
  }
}

function updateTempo () {
  tempo = slider.value();
  speed = avartana * (60 / tempo) * 1000;
}

function playTala() {
  if (playing == false) {
    timeDiff = millis();
    cursor = new CreateCursor();
    // shade = new CreateShade();
    playing = true;
    button.html(lang_stop);
    strokeToPlay = 0;
    strokePlayer(0);
    // showCursor.removeAttribute("disabled");
    // showCursor.attribute("style", "color:rgba(0, 0, 0, 0.6);");
    // showTala.removeAttribute("disabled");
    // showTala.attribute("style", "color:rgba(0, 0, 0, 0.6);");
  } else {
    playing = false;
    button.html(lang_start);
    // showCursor.attribute("disabled", "true");
    // showCursor.attribute("style", "color:rgba(0, 0, 0, 0.4);");
    // showTala.attribute("disabled", "true");
    // showTala.attribute("style", "color:rgba(0, 0, 0, 0.4);");
  }
}

function mouseClicked() {
  if (loaded == false) {
    var init = millis();
    cha = loadSound("../sounds/mrdangamStrokes/cha.mp3");
    soundDic["cha"] = cha;
    dheem = loadSound("../sounds/mrdangamStrokes/dheem.mp3");
    soundDic["dheem"] = dheem;
    dhin = loadSound("../sounds/mrdangamStrokes/dhin.mp3");
    soundDic["dhin"] = dhin;
    num = loadSound("../sounds/mrdangamStrokes/num.mp3");
    soundDic["num"] = num;
    ta = loadSound("../sounds/mrdangamStrokes/ta.mp3");
    soundDic["ta"] = ta;
    tha = loadSound("../sounds/mrdangamStrokes/tha.mp3");
    soundDic["tha"] = tha;
    tham = loadSound("../sounds/mrdangamStrokes/tham.mp3");
    soundDic["tham"] = tham;
    thi = loadSound("../sounds/mrdangamStrokes/thi.mp3");
    soundDic["thi"] = thi;
    thom = loadSound("../sounds/mrdangamStrokes/thom.mp3");
    soundDic["thom"] = thom;
    click = loadSound("../sounds/click.mp3");
    soundDic["click"] = click;
    cymbals = loadSound("../sounds/cymbals.mp3");
    soundDic["cymbals"] = cymbals;
    var end = millis();
    print('Sounds loaded in ' + str(end-init)/1000 + ' seconds.');
    loaded = true;
  }
  if (playing == false) {
    if (strokeCircles.length > 0) {
      for (var i = 0; i < strokeCircles[int(thekaMenu.value())].length; i++) {
        strokeCircles[int(thekaMenu.value())][i].clicked();
      }
    }
  }
}
