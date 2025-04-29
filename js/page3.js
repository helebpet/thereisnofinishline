let bgImage;
let cursorDiv;
let canvasReady = false;
let timeX, timeY;
let timeSpeedX = 2;
let timeSpeedY = 1.5;
let quoteX, quoteY;
let targetX, targetY;
let easing = 0.05;

let sunX, sunY;
let sunTargetY;
let sunRadius;
let sunColor = '#EF5C26';

const quoteText = [
  "Some call it EUPHORIA,",
  "Others say it's a new kind of",
  "MYSTICAL EXPERIENCE",
  "that propels you into an elevated",
  "state of consciousness."
];

let imagesLoaded = 0;

// --- New Variables for dynamic movement ---
let euphoriaTargetOffsetX = 0;
let euphoriaOffsetX = 0;
let revealOffsets = [];

function preload() {
  bgImage = loadImage('img/page3.jpg', imageLoaded, loadError);
}

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded >= 1) {
    console.log("Image loaded successfully.");
    canvasReady = true;
    select('#loader').hide();
  }
}

function loadError(err) {
  console.error("Image failed to load:", err);
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'none');
  frameRate(60);
  noCursor();
  cursorDiv = select('.custom-cursor');

  timeX = width / 4;
  timeY = height / 4;

  quoteX = width / 2;
  quoteY = height / 2;

  sunX = width / 2;
  sunY = height / 2;

  sunTargetY = sunY;

  updateSunSize();

  for (let i = 1; i < quoteText.length; i++) {
    revealOffsets[i] = width;
  }
}

function draw() {
  if (!canvasReady) return;

  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block');
  }

  drawBackground();
  drawGradientLines();
  updateSun();
  drawSun();
  drawText();
  updateCursor();
}

function drawBackground() {
  let aspectRatio = bgImage.width / bgImage.height;
  let canvasRatio = width / height;
  let drawWidth, drawHeight;

  if (canvasRatio > aspectRatio) {
    drawWidth = width;
    drawHeight = width / aspectRatio;
  } else {
    drawHeight = height;
    drawWidth = height * aspectRatio;
  }

  let offsetX = (width - drawWidth) / 2;
  let offsetY = (height - drawHeight) / 2;

  image(bgImage, offsetX, offsetY, drawWidth, drawHeight);
}

function drawGradientLines() {
  let startColor = color('#EF5C26');
  let endColor = color('#D7DA1B');
  let interColor = lerpColor(startColor, endColor, map(mouseX, 0, width, 0, 1));

  stroke(interColor);
  strokeWeight(1);

  for (let y = 0; y < height; y += 10) {
    line(0, y, width, y);
  }
}

function updateSun() {
  let centerThreshold = width * 0.3;
  if (mouseX > width / 2 + centerThreshold) {
    sunTargetY = -sunRadius;
  } else if (mouseX < width / 2 - centerThreshold) {
    sunTargetY = height + sunRadius;
  } else {
    sunTargetY = height / 2;
  }
  sunY += (sunTargetY - sunY) * easing;
}

function drawSun() {
  stroke(0);
  strokeWeight(1);
  fill(sunColor);
  ellipse(sunX, sunY, sunRadius, sunRadius);
}

// --- UPDATED drawText() with text moved up ---
function drawText() {
  targetX = mouseX;

  if (windowWidth <= 768) {
    targetY = height / 2.3;
  } else {
    targetY = height / 2.1; // mírně výš
  }

  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  noStroke();
  fill('#FCFCEC');
  textAlign(CENTER, CENTER);
  textFont('Termina');

  let fontSize = windowWidth / 45; // menší text
  textSize(fontSize);
  textStyle(BOLD);

  let lineHeight = fontSize * 1.15; // menší mezera mezi řádky

  let centerThreshold = width * 0.3;
  if (mouseX > width / 2 + centerThreshold) {
    euphoriaTargetOffsetX = -width / 4;
  } else if (mouseX < width / 2 - centerThreshold) {
    euphoriaTargetOffsetX = width / 4;
  } else {
    euphoriaTargetOffsetX = 0;
  }

  euphoriaOffsetX += (euphoriaTargetOffsetX - euphoriaOffsetX) * 0.05;

  text(quoteText[0], quoteX + euphoriaOffsetX, quoteY - lineHeight);

  for (let i = 1; i < quoteText.length; i++) {
    let revealTarget = (mouseX < width / 2 - centerThreshold) ? width :
                       (mouseX > width / 2 + centerThreshold) ? 0 : width / 2;
    revealOffsets[i] += (revealTarget - revealOffsets[i]) * 0.05;
    text(quoteText[i], quoteX - width / 2 + revealOffsets[i], quoteY + (i - 1) * lineHeight);
  }
}



function updateCursor() {
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  timeX = width / 4;
  timeY = height / 4;

  sunX = width / 2;
  sunY = height / 2;

  updateSunSize();
}

function updateSunSize() {
  sunRadius = width * 0.5;
}
