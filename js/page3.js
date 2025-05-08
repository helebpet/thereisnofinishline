// This sketch was organized and partially developed with the help of ChatGPT

// Global variables
let bgImage;
let nikeLogoImage;
let cursorDiv;
let canvasReady = false;
let quoteX, quoteY;
let targetX, targetY;
let easing = 0.05;

let nikeX, nikeY;
let nikeTargetY;
let nikeSize;

// Array of quote lines to display
const quoteText = [
  "Some call it EUPHORIA,",
  "Others say it's a new kind of",
  "MYSTICAL EXPERIENCE",
  "that propels you into an elevated",
  "state of consciousness."
];

let imagesLoaded = 0;
const totalImages = 2;

// Load background and Nike logo images
function preload() {
  bgImage = loadImage('./img/page3.jpg', 
    () => { imageLoaded('background'); }, 
    () => { loadError('background'); }
  );
  
  loadNikeLogo();
}

// Attempt to load the Nike logo from multiple paths due to the p5.js asset loading issue
function loadNikeLogo() {
  const pathsToTry = [
    './img/nikelogogreen.png',
    '/img/nikelogogreen.png',
    'img/nikelogogreen.png'
  ];
  
  tryNextPath(0);

  function tryNextPath(index) {
    if (index >= pathsToTry.length) {
      // If all paths fail, mark logo as failed
      window.nikeLogoFailed = true;
      imagesLoaded++;
      return;
    }
    
    const path = pathsToTry[index];
    
    try {
      loadImage(
        path,
        (img) => {
          nikeLogoImage = img;
          imageLoaded('nike logo');
        },
        () => {
          tryNextPath(index + 1); // Try next path on failure
        }
      );
    } catch (e) {
      tryNextPath(index + 1);
    }
  }
}

// Track successful image loads
function imageLoaded(imageName) {
  imagesLoaded++;
  if (imagesLoaded >= totalImages) {
    canvasReady = true;
    select('#loader').hide(); // Hide loader when ready
  }
}

// Handle image load failure
function loadError(imageName) {
  imagesLoaded++;
  if (imagesLoaded >= totalImages) {
    canvasReady = true;
    select('#loader').hide();
  }
}

// Setup canvas and initial values
function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'none'); // Hide until images are ready
  frameRate(60);
  noCursor(); // Hide default cursor
  cursorDiv = select('.custom-cursor');

  quoteX = width / 2;
  quoteY = height / 2;

  nikeX = width / 2;
  nikeY = height / 2;
  nikeTargetY = nikeY;

  updateNikeSize();
  createAndStyleTextElements();
}

// Create and style the quote text container
function createAndStyleTextElements() {
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

  let quoteDiv = createDiv('');
  quoteDiv.class('quote-text');
  quoteDiv.parent(textContainer);

  // Text styling
  quoteDiv.style('font-weight', '600');
  quoteDiv.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
  quoteDiv.style('line-height', '1.6');
  quoteDiv.style('letter-spacing', '-0.11em');
  quoteDiv.style('word-spacing', '0.15em');
  quoteDiv.style('color', '#FCFCEC');
  quoteDiv.style('font-family', 'Termina, sans-serif');
  quoteDiv.style('text-align', 'center');
  quoteDiv.style('transition', 'transform 0.8s ease, opacity 0.8s ease');
  quoteDiv.style('transform', 'translateX(0)');
  quoteDiv.style('opacity', '1');

  // Populate text
  let textContent = '';
  quoteText.forEach((line) => {
    textContent += line + '<br>';
  });
  quoteDiv.html(textContent);
}

// Main draw loop
function draw() {
  if (!canvasReady) return;

  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block'); // Reveal canvas
  }

  clear(); // Clear previous frame

  drawBackground();
  drawGradientLines();
  updateNikeLogo();
  drawNikeLogo();
  updateDOMText();
  updateCursor();
}

// Render background image centered and scaled
function drawBackground() {
  if (!bgImage) return;

  background(0);

  push();
  imageMode(CENTER);

  let scaleX = width / bgImage.width;
  let scaleY = height / bgImage.height;
  let scale = max(scaleX, scaleY);

  let newWidth = bgImage.width * scale;
  let newHeight = bgImage.height * scale;

  image(bgImage, width/2, height/2, newWidth, newHeight);
  pop();
}

// Draw horizontal gradient lines across screen
function drawGradientLines() {
  stroke(0);
  strokeWeight(1);
  for (let y = 0; y < height; y += 10) {
    line(0, y, width, y);
  }
}

// Update the Y position of the Nike logo based on mouseX
function updateNikeLogo() {
  let centerThreshold = width * 0.3;

  let logoAspectRatio = nikeLogoImage ? (nikeLogoImage.width / nikeLogoImage.height) : 1;
  let logoHeight = (nikeSize * 2) / logoAspectRatio;

  if (mouseX > width / 2 + centerThreshold) {
    nikeTargetY = -logoHeight/2; // Slide up offscreen
  } else if (mouseX < width / 2 - centerThreshold) {
    nikeTargetY = height + logoHeight/2; // Slide down offscreen
  } else {
    nikeTargetY = height / 2; // Center
  }

  nikeY += (nikeTargetY - nikeY) * easing; // Smooth easing motion
}

// Draw Nike logo or fallback placeholder if load failed
function drawNikeLogo() {
  if (!nikeLogoImage) {
    if (window.nikeLogoFailed) {
      push();
      fill(255, 165, 0);
      noStroke();
      ellipse(nikeX, nikeY, nikeSize, nikeSize/2);
      textAlign(CENTER, CENTER);
      fill(0);
      textSize(16);
      text("NIKE", nikeX, nikeY);
      pop();
    }
    return;
  }

  imageMode(CENTER);

  let logoAspectRatio = nikeLogoImage.width / nikeLogoImage.height;
  let logoWidth = nikeSize * 2;
  let logoHeight = logoWidth / logoAspectRatio;

  image(nikeLogoImage, nikeX, nikeY, logoWidth, logoHeight);
}

// Animate and offset DOM text based on mouse position
function updateDOMText() {
  targetX = mouseX;
  targetY = mouseY;

  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  let centerThreshold = width * 0.3;
  let container = select('#text-container');
  let quoteDiv = select('.quote-text');

  if (!container || !quoteDiv) return;

  // Distance from center determines offset
  let distanceFromCenterX = abs(mouseX - width/2) / (width/2);
  let distanceFromCenterY = abs(mouseY - height/2) / (height/2);
  let distanceFromCenter = constrain(max(distanceFromCenterX, distanceFromCenterY), 0, 1);

  if (distanceFromCenter < 0.3) {
    container.style('transform', 'translate(0, 0)');
  } else {
    let offsetX = map(quoteX, 0, width, -width/4, width/4);
    let offsetY = map(quoteY, 0, height, -height/4, height/4);
    container.style('transform', `translate(${offsetX}px, ${offsetY}px)`);
  }

  // Text movement depending on horizontal position
  if (mouseX > width / 2 + centerThreshold) {
    quoteDiv.style('transform', 'translateX(-10%)');
  } else if (mouseX < width / 2 - centerThreshold) {
    quoteDiv.style('transform', 'translateX(10%)');
  } else {
    quoteDiv.style('transform', 'translateX(0)');
  }
}

// Move custom cursor element to follow mouse
function updateCursor() {
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

// Handle window resize and reposition elements
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  nikeX = width / 2;
  nikeY = height / 2;
  updateNikeSize();
}

// Scale Nike logo size based on window width
function updateNikeSize() {
  nikeSize = width * 0.3;
}
