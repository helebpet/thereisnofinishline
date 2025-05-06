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

const quoteText = [
  "Some call it EUPHORIA,",
  "Others say it's a new kind of",
  "MYSTICAL EXPERIENCE",
  "that propels you into an elevated",
  "state of consciousness."
];

let imagesLoaded = 0;

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
  
  // Create and style the text elements
  createAndStyleTextElements();
}

function createAndStyleTextElements() {
  // Create a container div for text
  let textContainer = createDiv('');
  textContainer.id('text-container');
  textContainer.position(0, 0);
  textContainer.style('width', '100%');
  textContainer.style('height', '100%');
  textContainer.style('position', 'absolute');
  textContainer.style('display', 'flex');
  textContainer.style('justify-content', 'center');
  textContainer.style('align-items', 'center');
  textContainer.style('pointer-events', 'none');
  textContainer.style('transition', 'transform 0.8s ease');
  
  // Create a single div for all text content
  let quoteDiv = createDiv('');
  quoteDiv.class('quote-text');
  quoteDiv.parent(textContainer);
  
  // Apply the requested styling to the div
  quoteDiv.style('font-weight', '600');
  quoteDiv.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
  quoteDiv.style('line-height', '1.6');
  quoteDiv.style('letter-spacing', '-0.11em');
  quoteDiv.style('word-spacing', '0.15em');
  
  // Additional styling
  quoteDiv.style('color', '#FCFCEC');
  quoteDiv.style('font-family', 'Termina, sans-serif');
  quoteDiv.style('text-align', 'center');
  quoteDiv.style('transition', 'transform 0.8s ease, opacity 0.8s ease');
  quoteDiv.style('transform', 'translateX(0)');
  quoteDiv.style('opacity', '1');
  
  // Create the complete text content with line breaks
  let textContent = '';
  quoteText.forEach((line, index) => {
    textContent += line + '<br>';
  });
  quoteDiv.html(textContent);
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
  updateDOMText();
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

// ⬛️ Black horizontal lines
function drawGradientLines() {
  stroke(0); // black lines
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

// ☀️ Radial gradient sun with black outline
function drawSun() {
  let innerColor = color('#D7DA1B');
  let outerColor = color('#EF5C26');
  let steps = 100;

  noStroke();
  for (let r = sunRadius; r > 0; r -= sunRadius / steps) {
    let inter = map(r, 0, sunRadius, 0, 1);
    fill(lerpColor(innerColor, outerColor, inter));
    ellipse(sunX, sunY, r * 2, r * 2);
  }

  // Outline
  noFill();
  stroke(0);
  strokeWeight(1);
  ellipse(sunX, sunY, sunRadius * 2, sunRadius * 2);
}

// Update DOM text elements instead of drawing directly on canvas
function updateDOMText() {
  targetX = mouseX;
  targetY = mouseY;

  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  let centerThreshold = width * 0.3;
  let container = select('#text-container');
  let quoteDiv = select('.quote-text');
  
  if (!container || !quoteDiv) return;
  
  // Calculate how far the mouse is from center (as a percentage)
  let distanceFromCenterX = abs(mouseX - width/2) / (width/2);
  let distanceFromCenterY = abs(mouseY - height/2) / (height/2);
  let distanceFromCenter = constrain(max(distanceFromCenterX, distanceFromCenterY), 0, 1);
  
  // When mouse is in center, text stays centered
  // As mouse moves away, text follows with easing
  if (distanceFromCenter < 0.3) {
    // Mouse is near center - keep text centered
    container.style('transform', 'translate(0, 0)');
  } else {
    // Mouse is away from center - text follows with offset
    let offsetX = map(quoteX, 0, width, -width/4, width/4);
    let offsetY = map(quoteY, 0, height, -height/4, height/4);
    container.style('transform', `translate(${offsetX}px, ${offsetY}px)`);
  }
  
  // Handle text visibility and position based on mouse position
  if (mouseX > width / 2 + centerThreshold) {
    // Mouse on right side
    quoteDiv.style('transform', 'translateX(-10%)');
  } else if (mouseX < width / 2 - centerThreshold) {
    // Mouse on left side
    quoteDiv.style('transform', 'translateX(10%)');
  } else {
    // Mouse in center
    quoteDiv.style('transform', 'translateX(0)');
  }
}

// 🖱️ Custom cursor movement
function updateCursor() {
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

// 📐 Responsive canvas + sun sizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  timeX = width / 4;
  timeY = height / 4;

  sunX = width / 2;
  sunY = height / 2;

  updateSunSize();
}

// ☀️ Smaller, responsive sun
function updateSunSize() {
  sunRadius = width * 0.25; 
}