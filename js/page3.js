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

  sunX = width / 2; // Center the sun horizontally
  sunY = height / 2; // Center the sun vertically

  sunTargetY = sunY;

  // Set sunRadius proportional to screen size (larger than before)
  updateSunSize();
}

function draw() {
  if (!canvasReady) return;

  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block');
  }

  drawBackground();
  drawGradientLines(); // Change to the gradient line drawing
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
  // Calculate gradient color based on mouseX position
  let startColor = color('#EF5C26');  // Orange color
  let endColor = color('#D7DA1B');    // Yellow color
  let interColor = lerpColor(startColor, endColor, map(mouseX, 0, width, 0, 1));  // Interpolate between the two colors

  stroke(interColor);
  strokeWeight(1);

  // Draw static lines across the screen
  for (let y = 0; y < height; y += 10) {
    line(0, y, width, y);  // Static horizontal lines
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

function drawText() {
  targetX = mouseX;

  // Check if the device is mobile (screen width <= 768px)
  if (windowWidth <= 768) {
    // Move the text up slightly on mobile devices
    targetY = height / 1.9;  // Adjust the Y position as needed
  } else {
    targetY = height / 1.6;
  }

  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  noStroke();
  fill('#FCFCEC');
  textAlign(CENTER, CENTER);
  textFont('Termina');
  textSize(windowWidth / 26);  // Further decreased the size to make the text smaller
  textStyle(BOLD);

  let lineHeight = windowWidth / 14;
  for (let i = 0; i < quoteText.length; i++) {
    text(quoteText[i], quoteX, quoteY + (i - quoteText.length / 2) * lineHeight);
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

  // Recenter the sun on window resize
  sunX = width / 2;
  sunY = height / 2;

  // Update sun size proportional to new screen size
  updateSunSize();
}

function updateSunSize() {
  // Set the sun's radius to be 50% of the screen width
  sunRadius = width * 0.5; // Sun will take up half of the screen's width
}
