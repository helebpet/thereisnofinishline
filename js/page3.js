let bgImage;
let nikeLogoImage;
let cursorDiv;
let canvasReady = false;
let timeX, timeY;
let timeSpeedX = 2;
let timeSpeedY = 1.5;
let quoteX, quoteY;
let targetX, targetY;
let easing = 0.05;

let nikeX, nikeY;
let nikeTargetY;
let nikeSize;

const quoteText = [
  "Some call it EUPHORIA,",
  "Others say it's a new kind of",
  "MYSTICAL EXPERIENCE",
  "that propels you into an elevated",
  "state of consciousness."
];

let imagesLoaded = 0;
const totalImages = 2; // Now loading two images: background and Nike logo

let euphoriaTargetOffsetX = 0;
let euphoriaOffsetX = 0;
let revealOffsets = [];

function preload() {
  bgImage = loadImage('img/page3.jpg', imageLoaded, loadError);
  nikeLogoImage = loadImage('../img/nikelogogreen.png', imageLoaded, loadError);
}

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded >= totalImages) {
    console.log("All images loaded successfully.");
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

  nikeX = width / 2;
  nikeY = height / 2;

  nikeTargetY = nikeY;

  updateNikeSize();

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

  // Clear the canvas before drawing each frame
  clear();
  
  drawBackground();
  drawGradientLines();
  updateNikeLogo();
  drawNikeLogo();
  updateDOMText();
  updateCursor();
}

function drawBackground() {
  if (!bgImage) return;
  
  // Make sure background fills the entire screen with proper scaling
  background(0); // Add a black background first to ensure no gaps
  
  push();
  imageMode(CENTER);
  
  // Calculate scales to ensure image covers the entire canvas
  let scaleX = width / bgImage.width;
  let scaleY = height / bgImage.height;
  let scale = max(scaleX, scaleY); // Use the larger scale to ensure full coverage
  
  // Calculate new dimensions that will cover the screen
  let newWidth = bgImage.width * scale;
  let newHeight = bgImage.height * scale;
  
  // Draw the image centered on the canvas
  image(bgImage, width/2, height/2, newWidth, newHeight);
  pop();
}

// ⬛️ Black horizontal lines
function drawGradientLines() {
  stroke(0); // black lines
  strokeWeight(1);
  for (let y = 0; y < height; y += 10) {
    line(0, y, width, y);
  }
}

function updateNikeLogo() {
  let centerThreshold = width * 0.3;
  
  // Calculate logo height based on aspect ratio for proper offscreen positioning
  let logoAspectRatio = nikeLogoImage ? (nikeLogoImage.width / nikeLogoImage.height) : 1;
  let logoHeight = (nikeSize * 2) / logoAspectRatio;
  
  if (mouseX > width / 2 + centerThreshold) {
    nikeTargetY = -logoHeight/2; // Move logo just offscreen at the top
  } else if (mouseX < width / 2 - centerThreshold) {
    nikeTargetY = height + logoHeight/2; // Move logo just offscreen at the bottom
  } else {
    nikeTargetY = height / 2;
  }
  
  // Apply easing for smoother animation
  nikeY += (nikeTargetY - nikeY) * easing;
}

// Draw the Nike logo instead of sun
function drawNikeLogo() {
  if (!nikeLogoImage) return;
  
  imageMode(CENTER);
  
  // Calculate the aspect ratio of the logo to prevent squishing
  let logoAspectRatio = nikeLogoImage.width / nikeLogoImage.height;
  let logoWidth = nikeSize * 2; // Back to original multiplier
  let logoHeight = logoWidth / logoAspectRatio;
  
  // Draw the Nike logo at the current position while preserving aspect ratio
  image(nikeLogoImage, nikeX, nikeY, logoWidth, logoHeight);
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

// 📐 Responsive canvas + Nike logo sizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  timeX = width / 4;
  timeY = height / 4;

  nikeX = width / 2;
  nikeY = height / 2;

  updateNikeSize();
}

// Update Nike logo size based on window size
function updateNikeSize() {
  nikeSize = width * 0.3; // Moderate increase from original 0.25
}