let bgImage;
let cursorDiv;
let canvasReady = false;
let currentLine = 0;
let lineProgress = 0;
let timeX, timeY;
let timeSpeedX = 2;
let timeSpeedY = 1.5;
let quoteX, quoteY;
let targetX, targetY;
let easing = 0.05;

const quoteText = [
  "Some call it EUPHORIA,",
  "Others say it's a new kind of",
  "MYSTICAL EXPERIENCE",
  "that propels you into an elevated",
  "state of consciousness."
];

function preload() {
  bgImage = loadImage('img/page3.jpg', imageLoaded, loadError);
}

let imagesLoaded = 0;

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
  quoteY = height / 2; // start at middle vertically
}

function draw() {
  if (!canvasReady) return;

  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block');
  }

  // Background image
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

  // Animated black lines
  stroke(0);
  strokeWeight(1);
  for (let y = 0; y < currentLine * 10; y += 10) {
    line(0, y, width, y);
  }
  
  let y = currentLine * 10;
  if (y < height) {
    line(0, y, lineProgress, y);
    lineProgress += 10;
    if (lineProgress >= width) {
      currentLine++;
      lineProgress = 0;
    }
  }
  
  // Animate quote movement
  targetX = mouseX;
  targetY = height / 1.7; // center vertically

  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  noStroke();
  fill(255); 
  textAlign(CENTER, CENTER);
  textFont('Termina'); // Assume Termina is correctly loaded with weight 600
  textSize(windowWidth / 20); // Make text size responsive to window width
  
  let lineHeight = windowWidth / 15; // Adjust line height based on window width
  
  for (let i = 0; i < quoteText.length; i++) {
    text(quoteText[i], quoteX, quoteY + (i - quoteText.length / 2) * lineHeight);
  }

  // Move custom cursor
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  timeX = width / 4;
  timeY = height / 4;
}
