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
  if (mouseX > width * 0.7) {
    sunTargetY = -sunRadius;
  } else {
    sunTargetY = height + sunRadius;
  }
  sunY += (sunTargetY - sunY) * easing;
}

function drawSun() {
  stroke(0);
  strokeWeight(1);
  fill(sunColor);
  ellipse(sunX, sunY, sunRadius, sunRadius);
}

// --- NEW live dynamic drawText() ---
function drawText() {
  targetX = mouseX;

  if (windowWidth <= 768) {
    targetY = height / 1.9;
  } else {
    targetY = height / 1.6;
  }

  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  noStroke();
  fill('#FCFCEC');
  textAlign(CENTER, CENTER);
  textFont('Termina');
  textSize(windowWidth / 26);
  textStyle(BOLD);

  let lineHeight = windowWidth / 24;

  // --- Dynamic behavior ---
  if (mouseX > width * 0.6) {
    euphoriaTargetOffsetX = -width / 4; // Move left
  } else {
    euphoriaTargetOffsetX = 0; // Centered
  }

  euphoriaOffsetX += (euphoriaTargetOffsetX - euphoriaOffsetX) * 0.05; // Smooth easing

  text(quoteText[0], quoteX + euphoriaOffsetX, quoteY - lineHeight);

  for (let i = 1; i < quoteText.length; i++) {
    let desiredOffset;
    if (mouseX > width * 0.6) {
      desiredOffset = 0; // Bring lines to center
    } else {
      desiredOffset = width; // Push them off-screen right
    }

    revealOffsets[i] += (desiredOffset - revealOffsets[i]) * 0.05; // Smooth transition
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
