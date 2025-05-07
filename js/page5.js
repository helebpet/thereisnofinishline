let bgImage;
let cursorDiv;
let canvasReady = false;
let timeX, timeY;
let timeSpeedX = 2;
let timeSpeedY = 1.5;
let quoteX, quoteY;
let targetX, targetY;
let easing = 0.05;

// Text elements
let quoteContainer;
let quoteElements = [];
let typewriterElement;

const quoteText = [
  "The  EXPERIENCE  is  UNIQUE",
  "to  each  of  us,",
  "but  when  it  HAPPENS",
  "you  BREAK  THROUGH  a  BARRIER",
  "that  SEPARATES  you",
  "from  CASUAL  RUNNERS."
];

let imagesLoaded = 0;

// Typewriter animation variables
let typewriterText = "FOREVER.";
let typedLength = 0;
let lastTypeTime = 0;
let typeSpeed = 200; // milliseconds between each character
let typewriterStarted = false;
let typewriterDelay = 4000; // 4 seconds
let typewriterStartTime;

function preload() {
  bgImage = loadImage('img/page5.jpg', imageLoaded, loadError);
}

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded >= 1) {
    console.log("Image loaded successfully.");
    canvasReady = true;
    select('#loader').hide();
    createTextElements();
    typewriterStartTime = millis() + typewriterDelay;
  }
}

function loadError(err) {
  console.error("Image failed to load:", err);
}

function createTextElements() {
  // Create a container for all text elements
  quoteContainer = createDiv();
  quoteContainer.class('quote-container');
  quoteContainer.position(0, 0);
  quoteContainer.style('position', 'absolute');
  quoteContainer.style('width', '100%');
  quoteContainer.style('height', '100%');
  quoteContainer.style('pointer-events', 'none'); // Make it non-interactive
  quoteContainer.style('display', 'flex');
  quoteContainer.style('flex-direction', 'column');
  quoteContainer.style('align-items', 'center');
  quoteContainer.style('justify-content', 'center');
  
  // Create paragraph elements for each line of quote text
  for (let i = 0; i < quoteText.length; i++) {
    let textP = createP(quoteText[i]);
    textP.parent(quoteContainer);
    textP.class('quote-line');
    
    // Apply the styling you requested
    textP.style('font-weight', '600');
    textP.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
    textP.style('line-height', '1.6');
    textP.style('letter-spacing', '-0.11em');
    textP.style('word-spacing', '0.15em');
    
    // Initial text color (will be updated dynamically)
    textP.style('background', 'linear-gradient(to right, #D7DA1B, #04AD74)');
    textP.style('-webkit-background-clip', 'text');
    textP.style('background-clip', 'text');
    textP.style('color', 'transparent');  // Use color instead of text-fill-color
    textP.style('-webkit-text-fill-color', 'transparent');
    textP.style('font-family', 'Termina, sans-serif');
    textP.style('margin', '0');
    textP.style('padding', '0');
    textP.style('transform-origin', 'center');
    
    quoteElements.push(textP);
  }
  
  // Create the typewriter element
  typewriterElement = createP('');
  typewriterElement.parent(quoteContainer);
  typewriterElement.class('typewriter-text');
  
  // Apply the styling you requested
  typewriterElement.style('font-weight', '600');
  typewriterElement.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
  typewriterElement.style('line-height', '1.6');
  typewriterElement.style('letter-spacing', '-0.11em');
  typewriterElement.style('word-spacing', '0.15em');
  
  // Initial text color (will be updated dynamically)
  typewriterElement.style('background', 'linear-gradient(to right, #D7DA1B, #04AD74)');
  typewriterElement.style('-webkit-background-clip', 'text');
  typewriterElement.style('background-clip', 'text');
  typewriterElement.style('color', 'transparent');  // Use color instead of text-fill-color  
  typewriterElement.style('-webkit-text-fill-color', 'transparent');
  typewriterElement.style('font-family', 'Termina, sans-serif');
  typewriterElement.style('margin', '0');
  typewriterElement.style('padding', '0');
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
}

function draw() {
  if (!canvasReady) return;

  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block');
  }

  drawBackground();
  drawGradientLines();
  updateTextPositions();
  updateTypewriter();
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
  // Set the line color to black
  stroke(0); // Black color
  strokeWeight(1);

  for (let y = 0; y < height; y += 10) {
    line(0, y, width, y);
  }
}

function updateTextPositions() {
  if (!quoteElements.length) return;

  targetX = mouseX;

  // Adjusted Y positioning to move the text a bit lower
  if (windowWidth <= 768) {
    targetY = height / 2; // Move it to the middle of the screen on smaller screens
  } else {
    targetY = height / 1.8; // Slightly lower on larger screens
  }

  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  // Update the container position
  quoteContainer.style('transform', `translate(${quoteX - windowWidth/2}px, ${quoteY - windowHeight/2}px)`);

  // Calculate gradient angle based on mouse position
  // This creates a rotation effect where the gradient follows the mouse
  const gradientAngle = Math.atan2(mouseY - height/2, mouseX - width/2) * (180 / Math.PI);
  const gradientStr = `linear-gradient(${gradientAngle}deg, #D7DA1B, #04AD74)`;
  
  // Update each line position with the wave effect and dynamic gradient
  for (let i = 0; i < quoteElements.length; i++) {
    let direction = i % 2 === 0 ? 1 : -1;
    let offsetX = direction * sin(frameCount * 0.02 + i) * 20;
    
    quoteElements[i].style('transform', `translateX(${offsetX}px)`);
    
    // Make sure the text is visible with the gradient
    quoteElements[i].style('background', gradientStr);
    quoteElements[i].style('-webkit-background-clip', 'text');
    quoteElements[i].style('background-clip', 'text');
  }
  
  // Also update the typewriter element gradient
  if (typewriterElement) {
    typewriterElement.style('background', gradientStr);
    typewriterElement.style('-webkit-background-clip', 'text');
    typewriterElement.style('background-clip', 'text');
  }
}

function updateTypewriter() {
  // Start typewriter effect after delay
  if (millis() > typewriterStartTime) {
    if (!typewriterStarted) {
      typewriterStarted = true;
      lastTypeTime = millis();
    }

    let currentTime = millis();
    if (currentTime - lastTypeTime > typeSpeed && typedLength < typewriterText.length) {
      typedLength++;
      lastTypeTime = currentTime;
    }

    let displayText = typewriterText.substring(0, typedLength);
    typewriterElement.html(displayText);
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
}