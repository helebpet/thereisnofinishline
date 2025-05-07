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
let currentSentenceIndex = 0;
let sentenceStartTime;
let sentenceDisplayDuration = 2500; // Each sentence displays for 2.5 seconds

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
let typewriterDelay = 4000; // 4 seconds after last sentence
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
    sentenceStartTime = millis();
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
  
  // Create paragraph elements for each line of quote text but initially hide them
  for (let i = 0; i < quoteText.length; i++) {
    let textP = createP(quoteText[i]);
    textP.parent(quoteContainer);
    textP.class('quote-line');
    
    // Apply the styling
    textP.style('font-weight', '600');
    textP.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
    textP.style('line-height', '1.6');
    textP.style('letter-spacing', '-0.11em');
    textP.style('word-spacing', '0.15em');
    textP.style('color', '#FCFCEC'); // Cream color as requested
    textP.style('font-family', 'Termina, sans-serif');
    textP.style('margin', '0');
    textP.style('padding', '0');
    textP.style('transform-origin', 'center');
    textP.style('opacity', '0'); // Start hidden
    textP.style('transition', 'opacity 0.5s ease-in-out');
    textP.style('position', 'absolute');
    textP.style('text-align', 'center');
    
    quoteElements.push(textP);
  }
  
  // Create the typewriter element
  typewriterElement = createP('');
  typewriterElement.parent(quoteContainer);
  typewriterElement.class('typewriter-text');
  
  // Apply the styling
  typewriterElement.style('font-weight', '600');
  typewriterElement.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
  typewriterElement.style('line-height', '1.6');
  typewriterElement.style('letter-spacing', '-0.11em');
  typewriterElement.style('word-spacing', '0.15em');
  typewriterElement.style('color', '#FCFCEC'); // Cream color as requested
  typewriterElement.style('font-family', 'Termina, sans-serif');
  typewriterElement.style('margin', '0');
  typewriterElement.style('padding', '0');
  typewriterElement.style('opacity', '0'); // Start hidden
  typewriterElement.style('position', 'absolute');
  typewriterElement.style('text-align', 'center');
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
  updateSentenceDisplay();
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
  targetY = height / 2; // Center vertically

  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  // Update the container position
  quoteContainer.style('transform', `translate(${quoteX - windowWidth/2}px, ${quoteY - windowHeight/2}px)`);
}

function updateSentenceDisplay() {
  let currentTime = millis();
  let elapsedTime = currentTime - sentenceStartTime;
  
  // First handle the sentence animations
  if (currentSentenceIndex < quoteText.length) {
    // Hide all sentences
    for (let i = 0; i < quoteElements.length; i++) {
      if (i !== currentSentenceIndex) {
        quoteElements[i].style('opacity', '0');
      }
    }
    
    // Show the current sentence
    quoteElements[currentSentenceIndex].style('opacity', '1');
    
    // Move to next sentence after the display duration
    if (elapsedTime > sentenceDisplayDuration) {
      currentSentenceIndex++;
      sentenceStartTime = currentTime;
      
      // If we've shown all sentences, set up the typewriter
      if (currentSentenceIndex >= quoteText.length) {
        typewriterStartTime = currentTime + 500; // Small gap before typewriter starts
      }
    }
  } else {
    // All sentences have been shown, hide them all
    for (let i = 0; i < quoteElements.length; i++) {
      quoteElements[i].style('opacity', '0');
    }
    
    // Start typewriter effect
    if (currentTime > typewriterStartTime) {
      if (!typewriterStarted) {
        typewriterStarted = true;
        lastTypeTime = currentTime;
        typewriterElement.style('opacity', '1');
      }

      if (currentTime - lastTypeTime > typeSpeed && typedLength < typewriterText.length) {
        typedLength++;
        lastTypeTime = currentTime;
      }

      let displayText = typewriterText.substring(0, typedLength);
      typewriterElement.html(displayText);
    }
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